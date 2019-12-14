import React from 'react'
import { Provider } from 'react-redux'
import store from '../store'
import Counter from './Counter'
import PokemonsList from './PokemonsList'

export default function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Counter />
        <PokemonsList />
      </div>
    </Provider>
  )
}
