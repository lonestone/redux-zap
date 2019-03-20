import React from 'react'
import { useActions, useMappedState } from '../lib'
import { actions, IRootState } from '../store'

export default function Counter() {
  const { count, counting } = useMappedState((state: IRootState) => state.counter)
  const { increment, incrementAsync, decrement } = useActions(actions.counter)
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={decrement}>➖</button>
      <button onClick={() => increment(1)}>➕</button>
      <button onClick={() => increment(3)}>➕3</button>
      <button onClick={incrementAsync}>➕5{counting && '⏳'}</button>
    </div>
  )
}
