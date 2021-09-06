import { Effect, Dispatch, DisposeCb } from '../types'

export const none = <Msg>(): Effect<Msg> => async () => {}

export const exhaustiveCheck = (value: never): never => {
  throw new Error(`It must be never but it is ${value}`)
}

export const batch = <Msg>(effects: Effect<Msg>[]) => async (dispatch: Dispatch<Msg>, onDispose: (cb: DisposeCb) => void) => {
  for (let effect of effects) {
    await effect(dispatch, onDispose)
  }
}

export const map = <A, B>(effect: Effect<A>, f: (a: A) => B): Effect<B> => {
  return async (dispatch, onDispose: (cb: DisposeCb) => void) => {
    await effect((a) => {
      dispatch(f(a))
    }, onDispose)
  }
}


