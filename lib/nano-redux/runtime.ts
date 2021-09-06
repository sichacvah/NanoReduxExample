import {
  Pair,
  Effect,
  Dispatch,
  DisposeCb
} from './types'

type Runtime<Msg> = {
  dispose: () => void
  addListener: (id: string, listener: (msg: Msg) => void) => void
  removeListener: (id: string) => void
}


export function runtime <Model, Msg>(
  init: () => Pair<Model, Effect<Msg>>,
  update: (msg: Msg, model: Model) => Pair<Model, Effect<Msg>>,
  render: (model: Model, dispatch: Dispatch<Msg>) => void,
): Runtime<Msg> {
  const initResult = init()
  let currentState = initResult.first
  const dispatch = (msg: Msg) => {
    notifyListeners(msg, listeners)
    step(update(msg, currentState))
  }

  const notifyListeners = (msg: Msg, listeners: Record<string, ((action: Msg) => void)>) => {
    Object.values(listeners).forEach((l) => {
      l(msg)
    })
  }

  const onDisposeCbs: Array<DisposeCb> = []
  let listeners: Record<string, ((action: Msg) => void)> = {}

  const step = (next: Pair<Model, Effect<Msg>>) => {
    const [state, effect] = next
    currentState = state

    effect(dispatch, (onDispose) => {
      onDisposeCbs.push(onDispose)
    })
    render(currentState, dispatch)
  }
  step(initResult)

  return {
    dispose: () => {
      onDisposeCbs.forEach((cb) => {
        cb()
      })
      listeners = {}
    },
    addListener: (id: string, listener: (msg: Msg) => void) => {
      listeners[id] = listener
    },
    removeListener: (id: string) => {
      delete listeners[id]
    }

  }
}
