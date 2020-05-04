import axios from 'axios'
import { prepareStore } from 'redux-zap'

interface PokemonListEntry {
  readonly id: number
  readonly name: string
}

interface State {
  readonly loading: boolean
  readonly error: string | undefined
  readonly list: PokemonListEntry[] | undefined
}

const initialState: State = {
  loading: false,
  error: undefined,
  list: undefined
}

export default prepareStore(initialState, {
  async *load() {
    yield { loading: true, error: undefined }
    try {
      const list = await apiCall()
      yield { loading: false, list }
    } catch (error) {
      yield { loading: false, error: error.message }
    }
  }
})

async function apiCall(): Promise<PokemonListEntry[]> {
  const { data } = await axios.get<{
    results: Array<{ name: string; url: string }>
  }>('https://pokeapi.co/api/v2/pokemon/?limit=999')

  return data.results.map(entry => {
    const matchId = entry.url.match(/\/([0-9]+)\/$/)
    if (!matchId) {
      throw new Error(`Unexpected url: ${entry.url} - Impossible to extract Pokemon ID`)
    }
    return {
      id: parseInt(matchId[1], 10),
      name: entry.name
    }
  })
}
