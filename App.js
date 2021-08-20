import React from 'react';
import { applicationContainer } from './src/ApplicationContainer'
import { ProductsScreen, Root } from './src/Presentation'

const App = () => {
  const {store, dispatch} = applicationContainer()

  return (
    <Root store={store} dispatch={dispatch}>
      <ProductsScreen />
    </Root>
  )
}

export default App