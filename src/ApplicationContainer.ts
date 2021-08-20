import { atomRuntime } from '../lib/nano-redux/atom/atomRuntime'
import { ProductsInteractor } from './Products/ProductsInteractor'
import { update, init } from './Products/Domain'

export const applicationContainer = () => {
  const storeId = 4208
  const productsInteractor = new ProductsInteractor(storeId)
  const { store, dispatch } = atomRuntime(
    init,
    update(productsInteractor.fetchProducts, productsInteractor.showAlert)
  )

  return {
    store,
    dispatch
  }
}
