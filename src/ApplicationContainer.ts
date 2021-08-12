import { update, init } from './Domain'
import { atomRuntime } from '../lib/nano-redux/atom/atomRuntime'

export const applicationContainer = () => {
  const { store, dispatch } = atomRuntime(
    init,
    update
  )

  return {
    store,
    dispatch
  }
}
