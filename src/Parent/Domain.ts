import { Effect, pair, Pair, TypedData } from '../../lib/nano-redux/types'
import { map, none } from '../../lib/nano-redux/effect/utils'
import * as counter from '../Child/Domain'


export type Model = {
  ids: number[]
  byId: Record<number, counter.Model>
}

type NModel<K extends keyof any, T> = {
  ids: K[],
  byId: Record<K, T>
}

const add = <K extends keyof any, T>(model: NModel<K, T>, key: K, value: T): NModel<K, T> => {
  return {
    ...model,
    ids: model.ids.concat([key]),
    byId: {
      ...model.byId,
      [key]: value
    }
  }
}



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

const updateAddCounter = (getCounts: GetCounts) => (msg: AddCounter, model: Model): Pair<Model, Effect<Msg>> => {
  const counterKey = nextCounterID(model)
  const getCount = async () => {
    const { byId } = await getCounts()
    return byId[counterKey] ?? 0
  }
  const [counterModel, counterEffect] = counter.init(getCount)()
  
  return pair(
    {
      ...model,
      ids: model.ids.concat(counterKey),
      byId: {
        ...model.byId,
        [counterKey]: counterModel
      }
    },
    map(counterEffect, (msg) => counterMsg(counterKey, msg))
  )
}


const updateRemoveCounter = (putCounts: PutCounts) => (msg: RemoveCounter, model: Model): Pair<Model, Effect<Msg>> => {
  const putCountsEffect = makePutCountsEffect(putCounts)
  const byId = {...model.byId}
  delete byId[msg.data.id]
  const nextModel = {
    ...model,
    byId,
    ids: model.ids.filter(id => id !== msg.data.id) 
  }
  const counts = {
    ...nextModel,
    byId: Object.fromEntries(Object.entries(nextModel.byId).map(([id, m]) => [id, m.count]))
  }

  return pair(
    nextModel,
    putCountsEffect(counts)
  )
}

const updateSetCounts = (msg: SetCounters, model: Model): Pair<Model, Effect<Msg>> => {
  const counts = msg.data

  const nextModel: Model = {
    ids: counts.ids,
    byId: Object.fromEntries(counts.ids.map(id => [id, counter.makeModel(counts.byId[id])]))
  }
  return pair(
    nextModel,
    none()
  )
}



const updateCounterMsg = (putCounts: PutCounts) => (msg: CounterMsg, model: Model): Pair<Model, Effect<Msg>> => {
  const value = model.byId[msg.data.id]
  if (!value) return pair(model, none())

  const putCount: counter.PutCount = async (count) => {
    const counts = {
      ids: model.ids,
      byId: Object.fromEntries(Object.entries(model.byId).map(([id, m]) => [id, m.count]).concat([[msg.data.id, count]]))

    }
    await putCounts(counts)
  }

  const [counterModel, counterEffect] = counter.update(putCount)(msg.data.msg, value)
  return pair(
    {
      ...model,
      byId: {
        ...model.byId,
        [msg.data.id]: counterModel
      }
    },
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
