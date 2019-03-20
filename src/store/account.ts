import { prepareStore } from '../lib'

type IState = number

const initialState: IState = 0

export default prepareStore(initialState, {
  increment: (n?: number) => (state: IState) =>
    state + (typeof n === 'undefined' ? 1 : n),
  decrement: () => (state: IState) => state - 1
})
