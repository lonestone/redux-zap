import { Reducer } from 'redux'
import {
  IAction,
  IActionsParams,
  IPreparedStore,
  IRootState,
  ISimplePreparedStore,
  IStoreCreator,
  IThunkAction,
  IThunkActionsMap,
  IZap,
  IZapsMap
} from './interfaces'

export * from './interfaces'

export const actionPrefix = '@redux-zap/'

export function createReducer<State>(
  namespace: string,
  initialState: State
): Reducer<State, IAction<State>> {
  return function reducer(state = initialState, action) {
    if (action.type === actionPrefix + namespace) {
      // Transform and return state
      const newPartialState =
        typeof action.transform === 'function'
          ? action.transform(state)
          : action.transform
      if (typeof newPartialState === 'object') {
        return { ...state, ...newPartialState }
      } else {
        return newPartialState
      }
    }
    return state
  }
}

export function createAction<RootState, State, Params extends []>(
  namespace: string,
  zap: IZap<State, Params>
): IThunkAction<RootState, Params> {
  // Create redux-thunk action
  return (...params) => async (dispatch, getState) => {
    // Run action
    // Set current local state as thisArg
    const state: State = getState()[namespace]
    const transformOrIterator = zap.apply(state, params)

    // Dispatch actions
    if (
      typeof transformOrIterator === 'object' &&
      (transformOrIterator as any).next &&
      (transformOrIterator as any).throw &&
      (transformOrIterator as any).return
    ) {
      // Iterate asynchronously on actions
      for await (const transform of transformOrIterator) {
        dispatch({ type: actionPrefix + namespace, transform })
      }
    } else {
      dispatch({ type: actionPrefix + namespace, transform: transformOrIterator })
    }
  }
}

export function createActions<
  State,
  RootState extends IRootState,
  ActionsParams extends IActionsParams
>(namespace: string, zaps: IZapsMap<State, ActionsParams>) {
  // Iterate on each zap
  return Object.keys(zaps).reduce<IThunkActionsMap<RootState, ActionsParams>>(
    (actions, name: keyof ActionsParams) => {
      // Create action from zap
      actions[name] = createAction(namespace, zaps[name])
      return actions
    },
    {} as any
  )
}

export function prepareStore<State, ActionsParams extends IActionsParams>(
  initialState: State,
  zaps: IZapsMap<State, ActionsParams>
): IStoreCreator<State, ActionsParams> {
  return (namespace: string) => ({
    initialState,
    actions: createActions(namespace, zaps),
    reducer: createReducer(namespace, initialState)
  })
}

export function combineStores<
  StoresCreators extends Record<string, IStoreCreator<any, any>>
>(storeCreators: StoresCreators) {
  // Iterate on each store creator
  return Object.keys(storeCreators).reduce(
    (stores, namespace: keyof StoresCreators & string) => {
      const store = storeCreators[namespace](namespace)
      stores.initialState[namespace] = store.initialState
      stores.actions[namespace] = store.actions
      stores.reducers[namespace] = store.reducer
      return stores
    },
    {
      initialState: {},
      actions: {},
      reducers: {}
    } as ISimplePreparedStore
  ) as IPreparedStore<StoresCreators>
}
