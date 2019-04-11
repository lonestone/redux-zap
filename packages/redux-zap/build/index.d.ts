import { Reducer } from 'redux';
import { IAction, IActionsParams, IPreparedStore, IStoreCreator, IThunkAction, IThunkActionsMap, IZap, IZapsMap } from './interfaces';
export * from './interfaces';
export declare const actionPrefix = "@redux-zap/";
export declare function createReducer<State>(namespace: string, initialState: State): Reducer<State, IAction<State>>;
export declare function createAction<State, Params extends []>(namespace: string, zap: IZap<State, Params>): IThunkAction<State, Params>;
export declare function createActions<State, ActionsParams extends IActionsParams>(namespace: string, zaps: IZapsMap<State, ActionsParams>): IThunkActionsMap<State, ActionsParams>;
export declare function prepareStore<State, ActionsParams extends IActionsParams>(initialState: State, zaps: IZapsMap<State, ActionsParams>): IStoreCreator<State, ActionsParams>;
export declare function combineStores<StoresCreators>(storeCreators: StoresCreators): IPreparedStore<StoresCreators>;
