import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import { combineStores } from '../lib'
import counter from './counter'
import pokemons from './pokemons'

export const { reducers, actions, initialState } = combineStores({
  pokemons,
  counter
})

export type IRootState = typeof initialState

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default createStore(
  combineReducers(reducers),
  composeEnhancers(applyMiddleware(thunk))
)
