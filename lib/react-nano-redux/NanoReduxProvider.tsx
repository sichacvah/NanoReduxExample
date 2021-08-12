import React, { ReactNode } from 'react'
import { ReadonlyAtom } from '../atom'
import { Dispatch } from '../nano-redux/types'


export type Props<Model, Msg> = {
  store: ReadonlyAtom<Model>,
  dispatch: Dispatch<Msg>,
  children?: ReactNode | undefined
}


export const StoreContext = React.createContext<ReadonlyAtom<any>>(undefined)


export const DispatchContext = React.createContext<Dispatch<any>>(() => {})


export const NanoReduxProvider = <Model, Msg>(props: Props<Model, Msg>) => {
  return (
    <StoreContext.Provider value={props.store}>
      <DispatchContext.Provider value={props.dispatch}>
        {props.children}
      </DispatchContext.Provider>
    </StoreContext.Provider>
  )
}
