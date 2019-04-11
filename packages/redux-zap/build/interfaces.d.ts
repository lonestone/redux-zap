import { MapDispatchToPropsNonObject, MapDispatchToPropsParam, ResolveThunks } from 'react-redux';
import { Action, Reducer } from 'redux';
import { ThunkAction } from 'redux-thunk';
export declare type IStateTransform<State> = Partial<State> | ((state: State) => Partial<State>);
export declare type IZap<State, Params extends []> = (this: State, ...params: Params) => IStateTransform<State> | AsyncIterableIterator<IStateTransform<State>>;
export declare type IZapsMap<State, ZapsParams extends any> = {
    [name in keyof ZapsParams]: IZap<State, ZapsParams[name]>;
};
export interface IRootState {
    [namespace: string]: any;
}
export interface IAction<State> extends Action<string> {
    transform: IStateTransform<State>;
}
export declare type IReducersMap<RootState> = {
    [namespace in keyof RootState]: Reducer<RootState[namespace], IAction<RootState[namespace]>>;
};
export declare type IThunkAction<RootState, Params extends []> = (...params: Params) => ThunkAction<Promise<void>, RootState, undefined, IAction<RootState>>;
export declare type IThunkActionsMap<RootState, ActionsParams extends IActionsParams> = {
    [name in keyof ActionsParams]: IThunkAction<RootState, ActionsParams[name]>;
};
export declare type IDispatchActionsMap<ActionsParams extends any> = {
    [name in keyof ActionsParams]: (...params: ActionsParams[name]) => Promise<void>;
};
export interface IActionsParams {
    [name: string]: any;
}
export declare type IRootActionsParams<RootState extends IRootState> = {
    [namespace in keyof RootState]: IActionsParams;
};
export declare type IRootActionsMap<RootState extends IRootState, RootActionsParams extends IRootActionsParams<RootState>> = {
    [namespace in keyof RootState]: IThunkActionsMap<RootState, RootActionsParams[namespace]>;
};
export declare type IStoreCreator<State, ActionsParams extends IActionsParams, RootState = {}> = (namespace: string) => {
    initialState: State;
    actions: IThunkActionsMap<RootState, ActionsParams>;
    reducer: Reducer<State, IAction<State>>;
};
export declare type IStoreCreatorsMap<RootState extends IRootState, RootActionsParams extends IRootActionsParams<RootState>> = {
    [namespace in keyof RootState]: IStoreCreator<RootState[namespace], RootActionsParams[namespace]>;
};
export interface IPreparedStore<StoresCreators> {
    initialState: IRootStateFromConfig<StoresCreators>;
    reducers: IReducersMap<IRootStateFromConfig<StoresCreators>>;
    actions: IRootActionsMap<IRootStateFromConfig<StoresCreators>, IRootActionsParamsFromConfig<StoresCreators>>;
}
export declare type IRootStateFromConfig<StoresCreators> = {
    [namespace in keyof StoresCreators]: StoresCreators[namespace] extends (namespace: string) => {
        initialState: infer State;
    } ? State : never;
};
export declare type IRootActionsParamsFromConfig<StoresCreators> = {
    [namespace in keyof StoresCreators]: StoresCreators[namespace] extends (namespace: string) => {
        actions: IThunkActionsMap<unknown, infer ActionsParams>;
    } ? ActionsParams : never;
};
export declare type IConnectProps<mapStateToProps extends (state: IRootState) => any = () => {}, mapDispatchToProps extends MapDispatchToPropsParam<any, any> | MapDispatchToPropsNonObject<any, any> = {}> = ReturnType<mapStateToProps> & (mapDispatchToProps extends MapDispatchToPropsNonObject<infer TDispatchProps, any> ? TDispatchProps : ResolveThunks<mapDispatchToProps>);
