import { Action, Reducer } from 'redux'
import { ThunkAction } from 'redux-thunk'

export type IStateTransform<State> = Partial<State> | ((state: State) => Partial<State>)

export type IZap<State, Params extends []> = (
  this: State,
  ...params: Params
) => IStateTransform<State> | AsyncIterableIterator<IStateTransform<State>>

export type IZapsMap<State, ZapsParams extends any> = {
  [name in keyof ZapsParams]: IZap<State, ZapsParams[name]>
}

export type IRootState = Record<string, any>

export interface IAction<State> extends Action<string> {
  transform: IStateTransform<State>
}

export type IThunkAction<RootState, Params extends []> = (
  ...params: Params
) => ThunkAction<Promise<void>, RootState, undefined, IAction<RootState>>

export type IThunkActionsMap<RootState, ActionsParams extends IActionsParams> = {
  [name in keyof ActionsParams]: IThunkAction<RootState, ActionsParams[name]>
}

export type IDispatchActionsMap<ActionsParams extends any> = {
  [name in keyof ActionsParams]: (...params: ActionsParams[name]) => Promise<void>
}

export type IActionsParams = Record<string, any>

export type IStoreCreator<State, ActionsParams extends IActionsParams> = (
  namespace: string
) => {
  initialState: State
  actions: {
    [name in keyof ActionsParams]: IThunkAction<unknown, ActionsParams[name]>
  }
  reducer: Reducer<State, IAction<State>>
}

export interface ISimplePreparedStore<RootState = Record<string, any>> {
  initialState: RootState
  reducers: {
    [namespace in keyof RootState]: Reducer<
      RootState[namespace],
      IAction<RootState[namespace]>
    >
  }
  actions: {
    [namespace in keyof RootState]: {
      [name in string]: IThunkAction<RootState, any>
    }
  }
}

// Full IPreparedStore interface
// export interface IPreparedStore<
//   StoresCreators extends Record<string, IStoreCreator<any, any>>,
//   RootState = IRootStateFromConfig<StoresCreators>
// > extends ISimplePreparedStore {{
//   initialState: RootState
//   reducers: IReducersMap<RootState>
//   actions: IRootActionsMap<RootState, IRootActionsParamsFromConfig<StoresCreators>>
// }

// export type IRootActionsParams<Namespace extends string> = {
//   [namespace in Namespace]: IActionsParams
// }

// export type IRootActionsMap<
//   RootState extends IRootState,
//   RootActionsParams extends IRootActionsParams<keyof RootState & string>
// > = {
//   [namespace in keyof RootState & string]: IThunkActionsMap<
//     RootState,
//     RootActionsParams[namespace]
//   >
// }

// export type IReducersMap<RootState> = {
//   [namespace in keyof RootState]: Reducer<
//     RootState[namespace],
//     IAction<RootState[namespace]>
//   >
// }

// export type IRootStateFromConfig<StoresCreators> = {
//   [namespace in keyof StoresCreators]: StoresCreators[namespace] extends IStoreCreator<
//     infer State,
//     any
//   >
//     ? State
//     : never
// }

// export type IRootActionsParamsFromConfig<StoresCreators> = {
//   [namespace in keyof StoresCreators]: StoresCreators[namespace] extends IStoreCreator<
//     any,
//     infer ActionsParams
//   >
//     ? ActionsParams
//     : never
// }

// Resolved IPreparedStore interface:
export interface IPreparedStore<
  StoresCreators extends Record<string, IStoreCreator<any, any>>,
  RootState = {
    [namespace in keyof StoresCreators]: StoresCreators[namespace] extends IStoreCreator<
      infer State,
      any
    >
      ? State
      : never
  }
> extends ISimplePreparedStore {
  // State
  initialState: RootState
  // Reducers
  reducers: {
    [namespace in keyof RootState]: Reducer<
      RootState[namespace],
      IAction<RootState[namespace]>
    >
  }
  // Actions
  actions: {
    [namespace in keyof StoresCreators]: StoresCreators[namespace] extends IStoreCreator<
      any,
      infer ActionsParams
    >
      ? {
          [name in keyof ActionsParams]: (
            ...params: ActionsParams[name]
          ) => ThunkAction<Promise<void>, RootState, undefined, IAction<RootState>>
        }
      : never
  }
}
