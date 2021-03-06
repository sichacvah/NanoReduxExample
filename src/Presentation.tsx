import React from 'react'
import {AtomRuntime} from '../lib/nano-redux/atom/atomRuntime'
import {NanoReduxProvider} from '../lib/react-nano-redux/NanoReduxProvider'
import {useDispatch, useStoreState} from '../lib/react-nano-redux/hooks'
import { Model, Msg } from './Parent/Domain'
import { Counters } from './Parent/Presentation'

type Props = AtomRuntime<Model, Msg>

export const Root: React.FC<Props> = ({ store, dispatch, children }) => {
  return (
    <NanoReduxProvider store={store} dispatch={dispatch} >
      {children}
    </NanoReduxProvider>
  )
}

export const Counter = () => {
  const dispatch = useDispatch<Msg>()
  const state = useStoreState<Model>()
  return (
    <Counters model={state} dispatch={dispatch} />
  )
}

