import { Effect, Dispatch } from '../types'

export const none = <Msg>(): Effect<Msg> => async () => {}

export const batch = <Msg>(effects: Effect<Msg>[]) => async (dispatch: Dispatch<Msg>) => {
  for (let effect of effects) {
    await effect(dispatch)
  }
}

export const map = <A, B>(effect: Effect<A>, f: (a: A) => B): Effect<B> => {
  return async (dispatch) => {
    await effect((a) => {
      dispatch(f(a))
    })
  }
}


