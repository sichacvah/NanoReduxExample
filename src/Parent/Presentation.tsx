import { Dispatch } from '../../lib/nano-redux/types'
import React from 'react'
import { Model, Msg, counterMsg, removeCounter, addCounter } from '../Parent/Domain'
import {
  ScrollView,
  StyleSheet,
  View
} from 'react-native'
import { Counter } from '../Child/Presentation'
import { Msg as ChildMsg } from '../Child/Domain'
import { BottomButton, SquareButton } from '../UIKit'

type Props = {
  dispatch: Dispatch<Msg>,
  model: Model
}

export const Counters: React.FC<Props> = ({ dispatch, model }) => {
  const {ids, byId} = model

  const childDispatch = (id: number) => (msg: ChildMsg) => {
    dispatch(counterMsg(id, msg))
  }

  const deleteCounter = (id: number) => () => {
    dispatch(removeCounter(id))
  }

  const onAddCounter = () => {
    dispatch(addCounter)
  }

  return (
    <>
      <ScrollView style={styles.container}>
        {ids.map(id => (<View key={id} style={{ paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-around' }}><Counter key={id} model={byId[id]} dispatch={childDispatch(id)} /><View style={{ width: 12 }} /><SquareButton title="Del" onPress={deleteCounter(id)} /></View>))}
      </ScrollView>
      <View>
        <BottomButton title='ADD' onPress={onAddCounter} />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingVertical: 50 }
})
