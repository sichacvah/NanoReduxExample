import { update, init } from './Parent/Domain'
import { atomRuntime } from '../lib/nano-redux/atom/atomRuntime'
import { PersistService } from './Services'

export const applicationContainer = () => {
  const KEY = 'COUNTERS_KEY'
  const persistService = new PersistService(KEY)
  const { store, dispatch, dispose } = atomRuntime(
    init(persistService.getCounts),
    update(persistService.putCounts, persistService.getCounts)
  )

  return {
    store,
    dispatch,
    dispose
  }
}
