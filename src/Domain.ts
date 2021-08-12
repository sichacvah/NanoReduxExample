import { pair, Pair, Effect } from '../lib/nano-redux/types'
import { none } from '../lib/nano-redux/effect/utils'


// MODEL

export type Model = {
  count: number
}

// MSG
export enum MsgType {
  INCREMENT = 'INCREMENT',
  DECREMENT = 'DECREMENT'
}

export const decrement = {
  type: MsgType.DECREMENT,
}

export const increment = {
  type: MsgType.INCREMENT
} 
export type Msg = typeof decrement | typeof increment

// UPDATE

export const update = (msg: Msg, model: Model): Pair<Model, Effect<Msg>> => {
  switch (msg.type) {
    case MsgType.DECREMENT:
      return pair({...model, count: model.count - 1}, none())
    case MsgType.INCREMENT:
      return pair({...model, count: model.count + 1}, none())
  }
}

// INIT
export const init = () => pair<Model, Effect<Msg>>({count: 0}, none())

