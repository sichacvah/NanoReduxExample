import React from 'react'
import {
  ScrollView, StyleSheet,
} from 'react-native';
import {Row, SquareButton, P} from './UIKit'
import {AtomRuntime} from '../lib/nano-redux/atom/atomRuntime'
import {NanoReduxProvider} from '../lib/react-nano-redux/NanoReduxProvider'
import {useDispatch, useStoreState} from '../lib/react-nano-redux/hooks'
import { decrement, increment, Model, Msg } from './Domain'
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
    <ScrollView style={styles.container}>
      <Row>
        <SquareButton
          onPress={() => dispatch(decrement)}
          title="−" />
        <P>{state.count}</P>
        <SquareButton
          onPress={() => dispatch(increment)}
          title="+" />
      </Row>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingVertical: 50 }
})


