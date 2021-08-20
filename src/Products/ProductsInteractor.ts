import { ToastAndroid } from 'react-native'
import {Product, FetchProducts, ProductsResponse, ShowAlert} from './types'




export class ProductsInteractor {
  storeId: number
  constructor(storeId: number) {
    this.storeId = storeId
  }

  showAlert: ShowAlert = (message: string) => {
    ToastAndroid.show(message, ToastAndroid.LONG)
  }

  fetchProducts: FetchProducts = async (pageNumber) => {
    const url = `https://api.sbermarket.ru/v2/products?sid=${this.storeId}&page=${pageNumber}&q='сыр'`
    const response = await fetch(url)
    const products: ProductsResponse = await response.json()
    return products
  }
}


