import { Action, Reducer } from 'redux';
import { ThunkAction } from 'redux-thunk';
export declare type IStateTransform<State> = Partial<State> | ((state: State) => Partial<State>);
export declare type IZapReturn<State> = IStateTransform<State> | AsyncIterableIterator<IStateTransform<State>>;
export declare type IZap<State, Params extends []> = (this: State, ...params: Params) => IZapReturn<State>;
export declare type IZapsMap<State, ZapsParams extends any> = {
    [name in keyof ZapsParams]: IZap<State, ZapsParams[name]>;
};
export declare type IRootState = Record<string, any>;
export interface IAction<State> extends Action<string> {
    transform: IStateTransform<State>;
}
export declare type IThunkAction<RootState, Params extends []> = (...params: Params) => ThunkAction<Promise<void>, RootState, undefined, IAction<RootState>>;
export declare type IThunkActionsMap<RootState, ActionsParams extends IActionsParams> = {
    [name in keyof ActionsParams]: IThunkAction<RootState, ActionsParams[name]>;
};
export declare type IDispatchActionsMap<ActionsParams extends any> = {
    [name in keyof ActionsParams]: (...params: ActionsParams[name]) => Promise<void>;
};
export declare type IActionsParams = Record<string, any>;
export declare type IStoreCreator<State, ActionsParams extends IActionsParams> = (namespace: string) => {
    initialState: State;
    actions: {
        [name in keyof ActionsParams]: IThunkAction<unknown, ActionsParams[name]>;
    };
    reducer: Reducer<State, IAction<State>>;
};
export interface ISimplePreparedStore<RootState = Record<string, any>> {
    initialState: RootState;
    reducers: {
        [namespace in keyof RootState]: Reducer<RootState[namespace], IAction<RootState[namespace]>>;
    };
    actions: {
        [namespace in keyof RootState]: {
            [name in string]: IThunkAction<RootState, any>;
        };
    };
}
export interface IPreparedStore<StoresCreators extends Record<string, IStoreCreator<any, any>>, RootState = {
    [namespace in keyof StoresCreators]: StoresCreators[namespace] extends IStoreCreator<infer State, any> ? State : never;
}> extends ISimplePreparedStore {
    initialState: RootState;
    reducers: {
        [namespace in keyof RootState]: Reducer<RootState[namespace], IAction<RootState[namespace]>>;
    };
    actions: {
        [namespace in keyof StoresCreators]: StoresCreators[namespace] extends IStoreCreator<any, infer ActionsParams> ? {
            [name in keyof ActionsParams]: (...params: ActionsParams[name]) => ThunkAction<Promise<void>, RootState, undefined, IAction<RootState>>;
        } : never;
    };
}
