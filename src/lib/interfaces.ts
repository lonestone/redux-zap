import {
  MapDispatchToPropsNonObject,
  MapDispatchToPropsParam,
  ResolveThunks
} from 'react-redux'
import { Action, Reducer } from 'redux'
import { ThunkAction } from 'redux-thunk'

export type IStateTransform<State> = Partial<State> | ((state: State) => Partial<State>)

export interface IRootState {
  [namespace: string]: any
}

export interface IAction<State> extends Action<string> {
  transform: IStateTransform<State>
}

export type IReducersMapObject<RootState> = {
  [namespace in keyof RootState]: Reducer<
    RootState[namespace],
    IAction<RootState[namespace]>
  >
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
    RootState,
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

export type IStoreCreator<State, ActionsParams extends IActionsParams, RootState = {}> = (
  namespace: string
) => {
  initialState: State
  actions: IThunkActionsMap<RootState, ActionsParams>
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

/*
  Interface to get Props from mapStateToProps and mapDispatchToProps
  Useful to connect a component with full typing

  Example:
  type IProps = IConnectProps<typeof mapStateToProps, typeof mapDispatchToProps>
*/

export type IConnectProps<
  mapStateToProps extends (state: IRootState) => any,
  mapDispatchToProps extends
    | MapDispatchToPropsParam<any, any>
    | MapDispatchToPropsNonObject<any, any>
> = ReturnType<mapStateToProps> &
  (mapDispatchToProps extends MapDispatchToPropsNonObject<infer TDispatchProps, any>
    ? TDispatchProps
    : ResolveThunks<mapDispatchToProps>)
