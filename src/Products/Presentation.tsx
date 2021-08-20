import { Dispatch } from '../../lib/nano-redux/types'
import React from 'react'
import {View, FlatList, Text} from 'react-native'
import { Msg, Model, pagination, paginatorMsg } from './Domain'
import { Product } from './types'


type Props = {
  dispatch: Dispatch<Msg>,
  model: Model
}

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <View style={{ height: 80, paddingHorizontal: 24, paddingVertical: 12 }}>
      <Text>{product.name} - {product.price}</Text>
    </View>
  )
}

export const ProductsList = (props: Props) => {

  const { products } = props.model


  if (products.type === pagination.EState.Empty) {
    return <View style={{ flex: 1 }}><Text>Empty</Text></View>
  }

  if (products.type === pagination.EState.EmptyError) {
    return <View style={{ flex: 1 }}><Text>{products.data.error.message}</Text></View>
  }

  if (products.type === pagination.EState.EmptyProgress) {
    return <View style={{ flex: 1 }}><Text>Loading...</Text></View>
  }
  
  const onEndReached = () => {
    props.dispatch(paginatorMsg(pagination.loadMoreMsg)) 
  }

  return (
    <FlatList
      refreshing={products.type === pagination.EState.Refresh}
      onRefresh={() => props.dispatch(paginatorMsg(pagination.refreshMsg))}
      data={products.data.value}
      renderItem={({ item }) => <ProductCard product={item} />}
      keyExtractor={(product) => String(product.id)}
      onEndReached={onEndReached}
    />
  )
}

