# Redux Zap ⚡

> Enjoy coding your redux store, writing less code and harvesting full redux power.

## Table of contents

- [What is redux-zap, and why?](#What-is-redux-zap-and-why)
- [Install](#install)
- [Examples](#examples)
- [Usage](#usage)
  - [Initial state](#initial-state)
  - [Zaps](#zaps)
  - [Prepare store](#prepare-store)
  - [Add to redux store](#add-to-redux-store)
- [Connect to React components](#connect-to-react-components)
- [FAQ](#faq)
- [Known drawbacks](#known-drawbacks)
- [Author](#author)
- [License](#license)

## What is redux-zap, and why?

Redux is great, but there should be an **easier way to manage most stores** without compromise.

Redux Zap offers an opinionated **new way to use [redux](https://redux.js.org/)**, hacking the way reducers and actions work to provide an easier solution to write a redux store. It is meant to be used along with [redux](https://redux.js.org/) and [redux-thunk](https://github.com/reduxjs/redux-thunk).

With redux-zap, actions and reducers are replaced by simple **zaps**.

Don't worry, Redux Zap is composable with classic actions, reducers and middlewares (thunk, saga, etc). Integration into existing architecture should be a breeze.

⭐ Fully typed  
🦋 Ultra lightweight  
👌 No refactoring is needed for existing redux actions and reducers

_All examples here are in TypeScript, but you can use Javascript by removing types._

## Install

```bash
npm install redux-zap redux redux-thunk
```

If you're using TypeScript, add `"esnext.asynciterable"` to `lib` in tsconfig.ts:

```json
{
  "lib": ["es6", "dom", "esnext.asynciterable"],
  ...
}
```

Don't worry about browser compatibility, a polyfill is included to run AsyncIterators.

## Examples

- [React webapp example](https://github.com/lonestone/redux-zap/tree/master/examples/react)

## Usage

A store is made of an initial state and zaps.

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

Or in plain Javascript:

```js
const initialState = {
  count: 0,
  counting: false
}
```

### Zaps

> A zap provides one or more partial states to modify the state of redux, and can execute asynchronous side effects (API calls, delay, etc).

A **state transform** is either a partial state or a function transforming the current state to a new partial state.

**A zap is a function**, possibly with argument, that **return a state transform** or an **async generator** of state transforms.

Types provided:

```ts
type StateTransform<State> = Partial<State> | ((state: State) => Partial<State>)

type IZapReturn<State> =
  | IStateTransform<State>
  | AsyncIterableIterator<IStateTransform<State>>

type Zap<State, Params extends []> = (this: State, ...params: Params) => IZapReturn<State>
```

Example of zaps for our counter example:

```ts
{
  // Function that returns a new partial state
  reset: () => ({ count: 0 }),

  // Function that returns a state transform
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

### Prepare store

Each store can be contained in a single file using the method `prepareStore`.

Example of `counter.ts` store:

```ts
import { prepareStore } from 'redux-zap'

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

Use the method `combineStores` from redux-zap to generate root initial state, reducers and actions from prepared stores.

- `initialState`: useful to get typing of root state
- `reducers`: can be merged with classic reducers and used with `combineReducers`
- `actions`: all actions, can be used with `mapDispatchToProps` or `dispatch`

```ts
import { combineStores } from 'redux-zap'
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

Example of `Counter.tsx`:

```tsx
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { actions, IRootState } from '../store'

const { reset, increment, incrementAsync, decrement } = actions.counter

export default function Counter() {
  const { count, counting } = useSelector((state: IRootState) => state.counter)
  const dispatch = useDispatch()
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch(reset())}>✖</button>
      <button onClick={() => dispatch(decrement(3))}>➖3</button>
      <button onClick={() => dispatch(decrement(1))}>➖</button>
      <button onClick={() => dispatch(increment())}>➕</button>
      <button onClick={() => dispatch(incrementAsync())}>➕5{counting && '⏳'}</button>
    </div>
  )
}
```

## FAQ

### Does it break redux philosophy?

Yes, Redux Zap is a hack. But it's effective and you can still use classic redux stores along with Redux Zap.

Redux Zap provides a way to express reducers and actions combined. It keeps the immutability principle and it respects the normal operation of redux.

### How can Redux Zap coexist with classic redux stores?

Redux Zap compute classic actions and reducers from zaps, so you can combine them easily with classic actions and reducers.

You can combine reducers and root state type like this:

```ts
import { applyMiddleware, combineReducers, createStore } from 'redux'
import thunk from 'redux-thunk'
import { combineStores } from 'redux-zap'
// Counter store written with Redux Zap
import counter from './counter'
// Counter store written in a classic way
import classicCounter, { IState as IClassicCounterState } from './classic-counter'

export const { reducers, actions, initialState } = combineStores({
  counter
})

// Combine root state type from zaps with other states (if you're using Typescript)
export type IRootState = typeof initialState & {
  classicCounter: IClassicCounterState
}

export default createStore(
  combineReducers({
    // Redux Zap reducers
    ...reducers,
    // Classic reducers
    classicCounter
  }),
  applyMiddleware(thunk)
)
```

### How can I access current state from a zap?

To set a new state computed with values from the current state, use an state transform (see [Zaps](#zaps)).

```ts
{
  increment: () => state => ({ count: state.count + 1 }),
}
```

If you need to access the current local state to perform a side effect, you can, but **try to avoid it if possible**. All zaps are bound to the local state, so you can access it with `this`.

```ts
{
  zapExample() {
    // this = current local state
    console.log('count', this.count)
    return { count: this.count + 1 }
  },
}
```

⚠ You shall not mutate the state

### How to call an action (or zap) from another action (or zap)?

To call a zap from another zap, you need to create it outside the zaps map provided to `prepareStore`.

```ts
const add = (n: number) => (state: IState) => ({ count: state.count + n })

export default prepareStore(initialState, {
  add,
  increment: () => add(1),
  decrement: () => add(-1)
})
```

You cannot use `this` to access other zaps because all zaps are bound to their local state.

You can also reuse async generators zaps:

```ts
async function* add(n: number): IZapReturn<IState> {
  for (let i = 0; i < n; i++) {
    // Wait for 1s
    await new Promise(resolve => setTimeout(resolve, 1000))
    // Increment state
    yield (state: IState) => ({ count: state.count + 1 })
  }
}

export default prepareStore(initialState, {
  async *increment5() {
    yield { counting: true }
    // Asynchronously yields all values yielded by add
    yield* await add(5)
    yield { counting: false }
  }
})
```

## Known drawbacks

- Actions are isolated to their local stores and cannot be intercepted by other reducers. To do the latter, you can use good old redux actions and reducers.

If you think you discovered a drawback, please tell me in the [issues](https://github.com/lonestone/redux-zap/issues).

## Author

Godefroy de Compreignac - [Lone Stone](https://lonestone.studio)

## License

MIT
