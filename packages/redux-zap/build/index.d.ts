import { Reducer } from 'redux';
import { IAction, IActionsParams, IPreparedStore, IRootState, IStoreCreator, IThunkAction, IThunkActionsMap, IZap, IZapsMap } from './interfaces';
export * from './interfaces';
export declare const actionPrefix = "@redux-zap/";
export declare function createReducer<State>(namespace: string, initialState: State): Reducer<State, IAction<State>>;
export declare function createAction<RootState, State, Params extends []>(namespace: string, zap: IZap<State, Params>): IThunkAction<RootState, Params>;
export declare function createActions<State, RootState extends IRootState, ActionsParams extends IActionsParams>(namespace: string, zaps: IZapsMap<State, ActionsParams>): IThunkActionsMap<RootState, ActionsParams>;
export declare function prepareStore<State, ActionsParams extends IActionsParams>(initialState: State, zaps: IZapsMap<State, ActionsParams>): IStoreCreator<State, ActionsParams>;
export declare function combineStores<StoresCreators extends Record<string, IStoreCreator<any, any>>>(storeCreators: StoresCreators): IPreparedStore<StoresCreators, { [namespace in keyof StoresCreators]: StoresCreators[namespace] extends IStoreCreator<infer State, any> ? State : never; }>;
