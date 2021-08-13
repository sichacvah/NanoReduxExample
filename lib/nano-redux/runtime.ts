import {
  Pair,
  Effect,
  Dispatch
} from './types'

export const runtime = <Model, Msg>(
  init: () => Pair<Model, Effect<Msg>>,
  update: (msg: Msg, model: Model) => Pair<Model, Effect<Msg>>,
  render: (model: Model, dispatch: Dispatch<Msg>) => void
) => {
  const initResult = init()
  let currentState = initResult.first
  const dispatch = (msg: Msg) => {
    step(update(msg, currentState))
  }

  const step = (next: Pair<Model, Effect<Msg>>) => {
    const [state, effect] = next
    currentState = state

    effect(dispatch)
    render(currentState, dispatch)
  }
  step(initResult)
}
