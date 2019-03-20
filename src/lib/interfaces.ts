import { Action, Reducer } from 'redux'
import { ThunkAction } from 'redux-thunk'

export type IStateTransform<State> = Partial<State> | ((state: State) => Partial<State>)

export interface IAction<State> extends Action<string> {
  transform: IStateTransform<State>
}

export type IThunkAction<State, Params extends []> = (
  ...params: Params
) => ThunkAction<Promise<void>, State, undefined, IAction<State>>

export type IThunkActionsMap<State, ActionsParams extends IActionsParams> = {
  [name in keyof ActionsParams]: IThunkAction<State, ActionsParams[name]>
}

export type IDispatchActionsMap<ActionsParams extends any> = {
  [name in keyof ActionsParams]: (...params: ActionsParams[name]) => Promise<void>
}

export interface IActionsParams {
  [name: string]: any
}

export type IRootActionsParams<RootState extends IRootState> = {
  [namespace in keyof RootState]: IActionsParams
}

export type IRootActionsMap<
  RootState extends IRootState,
  RootActionsParams extends IRootActionsParams<RootState>
> = {
  [namespace in keyof RootState]: IThunkActionsMap<
    RootState[namespace],
    RootActionsParams[namespace]
  >
}

export type IEffect<State, Params extends []> = (
  this: State,
  ...params: Params
) => IStateTransform<State> | AsyncIterableIterator<IStateTransform<State>>

export type IEffectMap<State, EffectsParams extends any> = {
  [name in keyof EffectsParams]: IEffect<State, EffectsParams[name]>
}

export interface IRootState {
  [namespace: string]: any
}

export type IReducersMapObject<RootState> = {
  [namespace in keyof RootState]: Reducer<
    RootState[namespace],
    IAction<RootState[namespace]>
  >
}

export type IStoreCreator<State, ActionsParams extends IActionsParams> = (
  namespace: string
) => {
  initialState: State
  actions: IThunkActionsMap<State, ActionsParams>
  reducer: Reducer<State, IAction<State>>
}

export type IStoreCreatorMap<
  RootState extends IRootState,
  RootActionsParams extends IRootActionsParams<RootState>
> = {
  [namespace in keyof RootState]: IStoreCreator<
    RootState[namespace],
    RootActionsParams[namespace]
  >
}

export interface IPreparedStore<StoresCreators> {
  initialState: IRootStateFromConfig<StoresCreators>
  reducers: IReducersMapObject<IRootStateFromConfig<StoresCreators>>
  actions: IRootActionsMap<
    IRootStateFromConfig<StoresCreators>,
    IRootActionsParamsFromConfig<StoresCreators>
  >
}

export type IRootStateFromConfig<StoresCreators> = {
  [namespace in keyof StoresCreators]: StoresCreators[namespace] extends (
    namespace: string
  ) => {
    initialState: infer State
  }
    ? State
    : never
}

export type IRootActionsParamsFromConfig<StoresCreators> = {
  [namespace in keyof StoresCreators]: StoresCreators[namespace] extends (
    namespace: string
  ) => {
    actions: IThunkActionsMap<unknown, infer ActionsParams>
  }
    ? ActionsParams
    : never
}

export type IDispatchFromAction<TAction extends IThunkAction<any, any>> = (
  ...params: Parameters<TAction>
) => Promise<void>

export type IDispatchsFromActions<ActionsMap extends IThunkActionsMap<any, any>> = {
  [name in keyof ActionsMap]: IDispatchFromAction<ActionsMap[name]>
}
