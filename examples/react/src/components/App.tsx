import React from 'react'
import { Provider } from 'react-redux'
import { StoreContext } from 'redux-zap-hooks'
import store from '../store'
import Counter from './Counter'
import Counter2 from './Counter2'
import Counter3 from './Counter3'
import PokemonsList from './PokemonsList'

export default function App() {
  return (
    <Provider store={store}>
      <StoreContext.Provider value={store}>
        <div className="App">
          <Counter />
          <Counter2 />
          <Counter3 />
          <PokemonsList />
        </div>
      </StoreContext.Provider>
    </Provider>
  )
}
