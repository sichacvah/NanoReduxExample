import { Dispatch } from '../../lib/nano-redux/types'
import React from 'react'
import { Model, Msg, increment, decrement } from './Domain'
import { P, Row, SquareButton } from '../UIKit'


type Props = {
  dispatch: Dispatch<Msg>,
  model: Model
}

export const Counter: React.FC<Props> = ({ dispatch, model }) => {
  return (
    <Row>
      <SquareButton
        onPress={() => dispatch(decrement)}
        title="−" />
      <P>{model.count}</P>
      <SquareButton
        onPress={() => dispatch(increment)}
        title="+" />      
    </Row>
  )
}

