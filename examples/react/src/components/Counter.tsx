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
      <button onClick={decrement}>➖</button>
      <button onClick={() => increment(1)}>➕</button>
      <button onClick={() => increment(3)}>➕3</button>
      <button onClick={() => incrementAsync().then(() => console.log('done'))}>
        ➕5{counting && '⏳'}
      </button>
    </div>
  )
}
