import { map } from '../../lib/nano-redux/effect/utils'
import { Effect, pair, TypedData } from '../../lib/nano-redux/types'
import * as paginator from '../Paginator'
import {FetchProducts, Product, ShowAlert} from './types'

export type Model = {
  products: paginator.Model<Product>
}

const initialLoadingEffect = (): Effect<Msg> => async (dispatch) => {
  dispatch(paginatorMsg(paginator.refreshMsg))
}

export const init = () => {
  return pair(
    { products: paginator.empty },
    initialLoadingEffect()
  )
}

export const pagination = paginator

enum EMsg {
  PAGINATOR = 'PAGINATOR'
}


type PaginatorMsg = TypedData<EMsg.PAGINATOR, { msg: paginator.Msg<Product>}>
export const paginatorMsg = (msg: paginator.Msg<Product>): PaginatorMsg => ({
  type: EMsg.PAGINATOR,
  data: { msg }
})

export type Msg = PaginatorMsg

export const update = (loadProducts: FetchProducts, showAlert: ShowAlert) => (msg: Msg, model: Model) => {
  const fetchPage = async (pageNumber: number) => {
    return (await loadProducts(pageNumber)).products
  }
  const errorHandler = (error: Error) => {
    showAlert(error.message)
  }
  const paginatorUpdate = paginator.update(fetchPage, errorHandler)
  switch (msg.type) {
    case EMsg.PAGINATOR:
      const [products, productsEffect] = paginatorUpdate(msg.data.msg, model.products)
      return pair(
        {...model, products },
        map(productsEffect, (m) => paginatorMsg(m))
      )
  }
}

