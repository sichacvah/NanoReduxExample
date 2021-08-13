import { pair, Pair, Effect, TypedData } from '../../lib/nano-redux/types'
import { exhaustiveCheck } from '../../lib/nano-redux/effect/utils'


// MODEL

export type Model = {
  count: number
}
export const makeModel = (count: number) => ({ count })

// MSG
export enum MsgType {
  INCREMENT = 'INCREMENT',
  DECREMENT = 'DECREMENT',
  SET_COUNT = 'SET_COUNT'
}

export const decrement: TypedData<MsgType.DECREMENT> = {
  type: MsgType.DECREMENT,
}

export const increment: TypedData<MsgType.INCREMENT> = {
  type: MsgType.INCREMENT
}
export const setCount =
  (count: number): TypedData<MsgType.SET_COUNT, number> => ({
    type: MsgType.SET_COUNT,
    data: count
  })
export type Msg = TypedData<MsgType.DECREMENT> |
  TypedData<MsgType.INCREMENT> |
  TypedData<MsgType.SET_COUNT, number>

// UPDATE

const updateModel = (msg: Msg, model: Model): Model => {
  switch (msg.type) {
    case MsgType.INCREMENT:
      return {...model, count: model.count + 1}
    case MsgType.DECREMENT:
      return {...model, count: model.count - 1}
    case MsgType.SET_COUNT:
      return {...model, count: msg.data}
  }
  return exhaustiveCheck(msg)
}

export type Update = ReturnType<typeof update>
export const update = (putCount: PutCount) => (
  msg: Msg,
  model: Model,
): Pair<Model, Effect<Msg>> => {
  const putCountEffect = makePutCountEffect(putCount)
  const nextModel = updateModel(msg, model)
  switch (msg.type) {
    case MsgType.DECREMENT:
      return pair(
        nextModel,
        putCountEffect(nextModel.count)
      )
    case MsgType.INCREMENT:
      return pair(
        nextModel,
        putCountEffect(nextModel.count)
      )
    case MsgType.SET_COUNT:
      return pair(
        nextModel,
        putCountEffect(nextModel.count)
      )
  }

  return exhaustiveCheck(msg)
}

// INIT
export const init = (getCount: GetCount) =>
  () => pair<Model, Effect<Msg>>(
    {count: 0},
    makeGetCountEffect(getCount)
  )

const makeGetCountEffect =
  (getCount: GetCount): Effect<Msg> =>
    async (dispatch) => {
      const count = await getCount()
      dispatch(setCount(count))
    }

const makePutCountEffect = (putCount: PutCount) =>
  (count: number): Effect<Msg> =>
    async (_) => {
      await putCount(count)
    }

// UseCases

export type GetCount = () => Promise<number>

export type PutCount = (count: number) => Promise<void>
