import { update, init } from './Domain'
import { atomRuntime } from '../lib/nano-redux/atom/atomRuntime'
import { PersistService } from './Services'

export const applicationContainer = () => {
  const KEY = 'COUNTER_KEY'
  const persistService = new PersistService(KEY)
  const { store, dispatch } = atomRuntime(
    init(persistService.getCount),
    update(persistService.putCount)
  )

  return {
    store,
    dispatch
  }
}
