import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { actions, IRootState } from '../store'

export default function PokemonsList() {
  const { loading, error, list } = useSelector((state: IRootState) => state.pokemons)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!loading) {
      dispatch(actions.pokemons.load())
    }
  }, [])

  return (
    <div>
      <h3>Pokemons:</h3>

      {loading && '⏳ Loading...'}

      {!loading && error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!loading && list && (
        <ul>
          {list.map(entry => (
            <li key={entry.id}>
              {entry.id} - {entry.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
