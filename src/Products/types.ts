export type Product = {
  id: number,
  name: string,
  price: number
}
export type ProductsResponse = {
  products: Product[]
}
export type FetchProducts = (pageNumber: number) => Promise<ProductsResponse>
export type ShowAlert = (message: string) => void