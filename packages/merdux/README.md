# merdux

> An insult to redux, making it tolerable

## Table of contents

- [What is merdux, and why?](#What-is-merdux-and-why)
- [Install](#install)
- [Usage](#usage)
  - [Initial state](#initial-state)
  - [Effects](#effects)
  - [Prepare Store](#prepare-store)
  - [Add to redux store](#add-to-redux-store)
- [Connect to React components](#connect-to-react-components)
- [React hooks](#react-hooks)
- [Know drawbacks](#know-drawbacks)
- [Author](#author)
- [License](#license)

## What is merdux, and why?

Merdux is an opinionated [**redux**](https://redux.js.org/) abstraction, hacking the way reducers and actions work to provide an easier solution to write a redux store.

Redux is great, but their should be an easier way to manage most stores, without compromise.

With merdux, actions and reducers are replaced by **effects**.

Merdux is composable with classic actions, reducers and middlewares (thunk, saga, etc). Integration into existing architecture should be a breeze.

- Fully typed
- Ultra lightweight
- Hooks and types provided for use with react-redux

_All examples here are in TypeScript, but you can use Javascript by removing types._

## Install

```bash
npm install merdux redux redux-thunk
```

## Usage

A store is made of an initial state and effects. Merdux provides functions to prepare stores from them and give them to redux.

### Initial state

Example of the initial state of a counter:

```ts
interface IState {
  readonly count: number
  readonly counting: boolean
}

const initialState: IState = {
  count: 0,
  counting: false
}
```

### Effects

In merdux, an effect provides one or more partial states to modify the state of redux, and can execute asynchronous side effects (API calls, delay).

A **state transform** is either a partial state or a function transforming the current state to a new partial state.

```ts
type StateTransform<State> = Partial<State> | ((state: State) => Partial<State>)
```

**An effect is a function**, possibly with argument, that **return a state transform** or an **async generator** of state transforms.

```ts
type Effect<State, Params extends []> = (
  this: State,
  ...params: Params
) => StateTransform<State> | AsyncIterableIterator<StateTransform<State>>
```

Example of effects for our counter:

```ts
{
  // Function that return a new partial state
  reset: () => ({ count: 0 }),

  // Function that return a state transform
  increment: () => state => ({ count: state.count + 1 }),

  // with an argument
  decrement: (n: number) => state => ({ count: state.count - n }),

  // Async generator that yields state transforms
  async *incrementAsync() {
    // Accessing current state
    console.log('count', this.count)

    // New partial state
    yield { counting: true }

    // Add 5 times 1 with delay
    for (let i = 1; i <= 5; i++) {
      // New partial state from current state
      yield state => ({ count: state.count + 1 })
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    yield { counting: false }
  }
}
```

### Prepare Store

Each store can be contained in a single file using the method `prepareStore`.

Example of `counter.ts`:

```ts
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
```

### Add to redux store

Merdux is meant to be used with [**redux**](https://redux.js.org/) and [**redux-thunk**](https://github.com/reduxjs/redux-thunk).

Use the method `combineStores` from merdux to generate root initial state, reducers and actions from prepared stores.

- `initialState`: useful to get typing of root state
- `reducers`: can be merged with classic reducers and used with `combineReducers`
- `actions`: all actions, can be used with `mapDispatchToProps` or `dispatch`

```ts
import { combineStores } from 'merdux'
import { applyMiddleware, combineReducers, createStore } from 'redux'
import thunk from 'redux-thunk'
import counter from './counter'
import pokemons from './pokemons'

export const { reducers, actions, initialState } = combineStores({
  // Prepared stores
  counter,
  pokemons
})

// Obtain and export full type of the root state
export type IRootState = typeof initialState

export default createStore(combineReducers(reducers), applyMiddleware(thunk))
```

## Connect to React components

You can connect your store as usual.

Import from the store file:

- `actions`: access them by namespace. eg: `actions.counter.increment`
- `IRootState`: type of the whole store, useful in `mapStateToProps`

Import from merdux:

- `IConnectProps`: useful to type props coming from redux

Example of `Counter.tsx`:

```tsx
import { IConnectProps } from 'merdux'
import React from 'react'
import { connect } from 'react-redux'
import { actions, IRootState } from '../store'

type IProps = IConnectProps<typeof mapStateToProps, typeof mapDispatchToProps>

class Counter extends React.Component<IProps> {
  public render() {
    const { count, counting, reset, increment, incrementAsync, decrement } = this.props
    return (
      <div>
        <p>Count: {count}</p>
        <button onClick={reset}>✖</button>
        <button onClick={() => decrement(3)}>➖3</button>
        <button onClick={() => decrement(1)}>➖</button>
        <button onClick={increment}>➕</button>
        <button onClick={incrementAsync}>➕5{counting && '⏳'}</button>
      </div>
    )
  }
}

const mapStateToProps = ({ counter }: IRootState) => ({ ...counter })
const mapDispatchToProps = actions.counter

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Counter)
```

## React hooks

Merdux provides hooks with the package `merdux-hooks`.

It uses [`redux-react-hook`](https://github.com/facebookincubator/redux-react-hook) under the hood and exports all of its exports.

Install it in your project:

```bash
npm install merdux-hooks
```

To use hooks, you need to provide the store to the StoreContext:

```tsx
import { StoreContext } from 'merdux-hooks'
import React from 'react'
import store from '../store'
import Counter from './Counter'

export default function App() {
  return (
    <StoreContext.Provider value={store}>
      <Counter />
    </StoreContext.Provider>
  )
}
```

Example of `Counter.tsx`, same as Counter above but with hooks:

```tsx
import { useActions, useMappedState } from 'merdux-hooks'
import React from 'react'
import { actions, IRootState } from '../store'

export default function Counter() {
  const { count, counting } = useMappedState((state: IRootState) => state.counter)
  const { reset, increment, incrementAsync, decrement } = useActions(actions.counter)
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={reset}>✖</button>
      <button onClick={() => decrement(3)}>➖3</button>
      <button onClick={() => decrement(1)}>➖</button>
      <button onClick={increment}>➕</button>
      <button onClick={incrementAsync)}>
        ➕5{counting && '⏳'}
      </button>
    </div>
  )
}
```

## Know drawbacks

- Actions are isolated to their local stores and cannot be intercepted by other reducers. To do the latter, you can use good old Redux actions and reducers.

## Author

Godefroy de Compreignac - [Lone Stone](https://lonestone.studio)

## License

MIT
