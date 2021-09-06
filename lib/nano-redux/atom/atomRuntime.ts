import { atom, ReadonlyAtom } from '../../atom'
import { runtime } from '../runtime'
import { Effect, Dispatch, Pair } from '../types'

export type AtomRuntime<Model, Msg> = {
  store: ReadonlyAtom<Model>
  dispatch: Dispatch<Msg>
  dispose: () => void
}

export const atomRuntime = <Model, Msg>(
  init: () => Pair<Model, Effect<Msg>>,
  update: (msg: Msg, model: Model) => Pair<Model, Effect<Msg>>
): AtomRuntime<Model, Msg> => {
  // set as any because 
  // we will set actual Model in atom
  // before return statement
  // empty object will not see in atom
  const atomState = atom<Model>({} as any)

  // same as atomState
  let dispatch: Dispatch<Msg> = () => {}

  const render = (model: Model, nextDispatch: Dispatch<Msg>) => {
    atomState.reset(model),
    dispatch = nextDispatch
  }

  const {dispose} = runtime(
    init,
    update,
    render
  )

  return {
    store: atomState,
    dispatch,
    dispose
  }
}
