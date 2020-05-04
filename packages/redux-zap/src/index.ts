import { Reducer } from 'redux'
import './asynciterator-polyfill'
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

export { IStateTransform, IZap, IZapReturn } from './interfaces'

// Overridable prefix for action types
let actionPrefix = ''
export function setActionPrefix(prefix: string) {
  actionPrefix = prefix
}

function createReducer<State>(
  namespace: string,
  initialState: State
): Reducer<State, IAction<State>> {
  const actionType = actionPrefix + namespace + '/'
  return function reducer(state = initialState, action) {
    if (action.type.indexOf(actionType) === 0) {
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

function createAction<RootState, State, Params extends []>(
  namespace: string,
  name: string,
  zap: IZap<State, Params>
): IThunkAction<RootState, Params> {
  const actionType = actionPrefix + namespace + '/' + name

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
      let count = 0
      for await (const transform of transformOrIterator) {
        dispatch({ type: actionType + '/' + count, transform })
        count++
      }
    } else {
      dispatch({ type: actionType, transform: transformOrIterator })
    }
  }
}

function createActions<
  State,
  RootState extends IRootState,
  ActionsParams extends IActionsParams
>(namespace: string, zaps: IZapsMap<State, ActionsParams>) {
  // Iterate on each zap
  return Object.keys(zaps).reduce<IThunkActionsMap<RootState, ActionsParams>>(
    (actions, name: keyof ActionsParams) => {
      // Create action from zap
      actions[name] = createAction(namespace, name as string, zaps[name])
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
