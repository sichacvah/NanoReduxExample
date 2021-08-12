import React from 'react';
import { applicationContainer } from './src/ApplicationContainer'
import { Counter, Root } from './src/Presentation'

const App = () => {
  const {store, dispatch} = applicationContainer()

  return (
    <Root store={store} dispatch={dispatch}>
      <Counter />
    </Root>
  )
}

export default App