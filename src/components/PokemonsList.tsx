import React, { useEffect } from 'react'
import { useActions, useMappedState } from '../lib'
import { actions, IRootState } from '../store'

export default function PokemonsList() {
  const { loading, error, list } = useMappedState((state: IRootState) => state.pokemons)
  const { load } = useActions(actions.pokemons)

  useEffect(() => {
    if (!loading && !list) {
      load()
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
