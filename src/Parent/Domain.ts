import { Effect, pair, Pair, TypedData } from '../../lib/nano-redux/types'
import { map, none } from '../../lib/nano-redux/effect/utils'
import * as counter from '../Child/Domain'

type OrderedObjectType<K extends keyof any, V> = {
  ids: K[],
  byId: Record<K, V>
}

const OrderedObject = {
  remove: <K extends keyof any, V>(obj: OrderedObjectType<K, V>, key: K) => {
    const copy = {...obj.byId}
    delete copy[key]
    console.log(key, typeof key)
    return {
      byId: copy,
      ids: obj.ids.filter(k => k !== key)
    }
  },
  map: <K extends keyof any, V, V2>(obj: OrderedObjectType<K, V>, f: (v: V) => V2): OrderedObjectType<K, V2> => {
    return {
      ids: obj.ids,
      byId: obj.ids.reduce((acc, key) => {
        return {
          ...acc,
          [key]: f(obj.byId[key])
        }
      }, {} as Record<K, V2>)
    }
  },
  set: <K extends keyof any, V>(obj: OrderedObjectType<K, V>, key: K, value: V) => {
    const {ids, byId} = obj
    return {
      ids: ids.includes(key) ? ids : ids.concat([key]),
      byId: {
        ...byId,
        [key]: value
      }
    }
  }
}



export type Model = OrderedObjectType<number, counter.Model>
enum MsgType {
  SET_COUNTERS = 'SET_COUNTERS',
  ADD_COUNTER = 'ADD_COUNTER',
  REMOVE_COUNTER = 'REMOVE_COUNTER',
  COUNTER_MSG = 'COUNTER_MSG'
}

type SetCounters = TypedData<MsgType.SET_COUNTERS, Counts>

type AddCounter = TypedData<MsgType.ADD_COUNTER>
export const addCounter: TypedData<MsgType.ADD_COUNTER> = {
  type: MsgType.ADD_COUNTER
}

type RemoveCounter = TypedData<MsgType.REMOVE_COUNTER, { id: number }>

export const removeCounter = (id: number): RemoveCounter => ({
  type: MsgType.REMOVE_COUNTER,
  data: {
    id
  }
})
type CounterMsg = TypedData<MsgType.COUNTER_MSG, { id: number, msg: counter.Msg }>
export const counterMsg = (id: number, msg: counter.Msg): CounterMsg => ({
  type: MsgType.COUNTER_MSG,
  data: {
    id,
    msg
  }
})

export type Msg =
  SetCounters |
  AddCounter |
  RemoveCounter |
  CounterMsg

const nextCounterID = (model: Model): number => {
  return Object.values(model.ids).length + 1
}

export const init = (getCounts: GetCounts) => (): Pair<Model, Effect<Msg>> => pair(
  {ids: [], byId: {}},
  makeGetCountsEffect(getCounts)
)

const updateAddCounter = (getCounts: GetCounts) => (_: AddCounter, model: Model): Pair<Model, Effect<Msg>> => {
  const counterKey = nextCounterID(model)
  const getCount = async () => {
    const { byId } = await getCounts()
    return byId[counterKey] ?? 0
  }
  const [counterModel, counterEffect] = counter.init(getCount)()
  
  return pair(
    OrderedObject.set(model, counterKey, counterModel),
    map(counterEffect, (msg) => counterMsg(counterKey, msg))
  )
}


const updateRemoveCounter = (putCounts: PutCounts) => (msg: RemoveCounter, model: Model): Pair<Model, Effect<Msg>> => {
  const putCountsEffect = makePutCountsEffect(putCounts)
  const nextModel = OrderedObject.remove(model, msg.data.id)
  const counts = OrderedObject.map(nextModel, (v) => v.count)

  return pair(
    nextModel,
    putCountsEffect(counts)
  )
}

const updateSetCounts = (msg: SetCounters, _: Model): Pair<Model, Effect<Msg>> => {
  const counts = msg.data
  const nextModel = OrderedObject.map(counts, (count) => counter.makeModel(count))
  return pair(
    nextModel,
    none()
  )
}



const updateCounterMsg = (putCounts: PutCounts) => (msg: CounterMsg, model: Model): Pair<Model, Effect<Msg>> => {
  const value = model.byId[msg.data.id]
  if (!value) return pair(model, none())

  const putCount: counter.PutCount = async (count) => {
    const counts = OrderedObject.set(OrderedObject.map(model, (v) => v.count), msg.data.id, count)
    await putCounts(counts)
  }

  const [counterModel, counterEffect] = counter.update(putCount)(msg.data.msg, value)
  return pair(
    OrderedObject.set(model, msg.data.id, counterModel),
    map(counterEffect, (m) => counterMsg(msg.data.id, m))
  )
}

export const update = (putCounts: PutCounts, getCounts: GetCounts) => (msg: Msg, model: Model): Pair<Model, Effect<Msg>> => {
  switch (msg.type) {
    case MsgType.ADD_COUNTER:
      return updateAddCounter(getCounts)(msg, model)
    case MsgType.REMOVE_COUNTER:
      return updateRemoveCounter(putCounts)(msg, model)
    case MsgType.SET_COUNTERS:
      return updateSetCounts(msg, model)
    case MsgType.COUNTER_MSG:
      return updateCounterMsg(putCounts)(msg, model)
  }
}

const makeGetCountsEffect = (getCounts: GetCounts): Effect<Msg> => async (dispatch) => {
  const counts = await getCounts()
  dispatch({
    type: MsgType.SET_COUNTERS,
    data: counts
  })
}

const makePutCountsEffect = (putCounts: PutCounts) => (counts: Counts): Effect<Msg> => {
  return async () => { await putCounts(counts) }
}

type Counts = {
  byId: Record<number, number>,
  ids: number[]
}

export type GetCounts = () => Promise<Counts>

export type PutCounts = (counts: Counts) => Promise<void>
