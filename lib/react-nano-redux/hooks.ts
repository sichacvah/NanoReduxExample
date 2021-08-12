import { useState, useContext, useEffect, useCallback } from 'react'
import { ReadonlyAtom } from '../atom'
import { Dispatch } from '../nano-redux/types'
import { StoreContext, DispatchContext } from './NanoReduxProvider'

export const useStore = <Model>() => {
  const store: ReadonlyAtom<Model> = useContext(StoreContext)
  return store
}

export const useDispatch = <Msg>() => {
  const dispatch: Dispatch<Msg> = useContext(DispatchContext)
  return dispatch
}

export const useStoreSelector = <Model, Slice>(selector: (model: Model) => Slice) => {
  const state = useStoreState<Model>()
  return selector(state)
}

export const useStoreState = <Model>() => {
  const store = useStore<Model>()
  const [state, setState] = useState(store.deref())

  useEffect(() => {
    const listener = (model: Model) => {
      setState(model)
    }
    store.addListener(listener)

    return () => {store.removeListener(listener)}
  }, [])

  return state
}
