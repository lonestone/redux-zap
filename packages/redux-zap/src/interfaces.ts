import { Action, Reducer } from 'redux'
import { ThunkAction } from 'redux-thunk'

export type StateTransform<State> = Partial<State> | ((state: State) => Partial<State>)

export type ZapReturn<State> =
  | StateTransform<State>
  | AsyncIterableIterator<StateTransform<State>>

export type Zap<State, Params extends []> = (
  this: State,
  ...params: Params
) => ZapReturn<State>

export type ZapsMap<State, ZapsParams extends any> = {
  [name in keyof ZapsParams]: Zap<State, ZapsParams[name]>
}

export type GenericRootState = Record<string, any>

export interface ZapAction<State> extends Action<string> {
  transform: StateTransform<State>
}

export type ZapActionCreator<RootState, Params extends []> = (
  ...params: Params
) => ThunkAction<Promise<void>, RootState, undefined, ZapAction<RootState>>

export type ThunkActionCreatorsMap<
  RootState,
  ActionsParams extends GenericActionsParams
> = {
  [name in keyof ActionsParams]: ZapActionCreator<RootState, ActionsParams[name]>
}

export type DispatchActionsMap<ActionsParams extends any> = {
  [name in keyof ActionsParams]: (...params: ActionsParams[name]) => Promise<void>
}

export type GenericActionsParams = Record<string, any>

export type StoreCreator<State, ActionsParams extends GenericActionsParams> = (
  namespace: string
) => {
  initialState: State
  actions: {
    [name in keyof ActionsParams]: ZapActionCreator<unknown, ActionsParams[name]>
  }
  reducer: Reducer<State, ZapAction<State>>
}

export interface SimplePreparedStore<RootState = GenericRootState> {
  initialState: RootState
  reducers: {
    [namespace in keyof RootState]: Reducer<
      RootState[namespace],
      ZapAction<RootState[namespace]>
    >
  }
  actions: {
    [namespace in keyof RootState]: {
      [name in string]: ZapActionCreator<RootState, any>
    }
  }
}

// Resolved IPreparedStore interface:
export interface PreparedStore<
  StoresCreators extends Record<string, StoreCreator<any, any>>,
  RootState = {
    [namespace in keyof StoresCreators]: StoresCreators[namespace] extends StoreCreator<
      infer State,
      any
    >
      ? State
      : never
  }
> extends SimplePreparedStore {
  // State
  initialState: RootState
  // Reducers
  reducers: {
    [namespace in keyof RootState]: Reducer<
      RootState[namespace],
      ZapAction<RootState[namespace]>
    >
  }
  // Actions
  actions: {
    [namespace in keyof StoresCreators]: StoresCreators[namespace] extends StoreCreator<
      any,
      infer ActionsParams
    >
      ? {
          [name in keyof ActionsParams]: (
            ...params: ActionsParams[name]
          ) => ThunkAction<Promise<void>, RootState, undefined, Action<RootState>>
        }
      : never
  }
}
