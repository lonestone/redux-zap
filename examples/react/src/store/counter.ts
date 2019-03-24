import { prepareStore } from 'merdux'

interface IState {
  readonly count: number
  readonly counting: boolean
}

const initialState: IState = {
  count: 0,
  counting: false
}

export default prepareStore(initialState, {
  reset: () => ({ count: 0 }),
  increment: () => state => ({ count: state.count + 1 }),
  decrement: (n: number) => state => ({ count: state.count - n }),

  async *incrementAsync() {
    console.log('count', this.count)
    yield { counting: true }
    for (let i = 1; i <= 5; i++) {
      yield state => ({ count: state.count + 1 })
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    yield { counting: false }
  }
})
