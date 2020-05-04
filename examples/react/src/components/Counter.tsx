import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { actions, RootState } from '../store'

const { reset, increment, incrementAsync, decrement } = actions.counter

export default function Counter() {
  const { count, counting } = useSelector((state: RootState) => state.counter)
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
