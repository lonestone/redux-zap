import { prepareStore } from '../lib'

interface IState {
  readonly count: number
  readonly counting: boolean
}

const initialState: IState = {
  count: 0,
  counting: false
}

export default prepareStore(initialState, {
  increment: (n: number) => state => ({ ...state, count: state.count + n }),
  decrement: () => state => ({ ...state, count: state.count - 1 }),

  async *incrementAsync() {
    console.log('count', this.count)
    yield state => ({ ...state, counting: true })
    for (let i = 1; i <= 5; i++) {
      yield state => ({ ...state, count: state.count + 1 })
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    yield state => ({ ...state, counting: false })
  }
})
