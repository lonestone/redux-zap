import { Reducer } from 'redux';
import { IAction, IActionsParams, IEffect, IEffectMap, IPreparedStore, IStoreCreator, IThunkAction, IThunkActionsMap } from './interfaces';
export * from './interfaces';
export declare const actionPrefix = "@merdux/";
export declare function createReducer<State>(namespace: string, initialState: State): Reducer<State, IAction<State>>;
export declare function createAction<State, Params extends []>(namespace: string, effect: IEffect<State, Params>): IThunkAction<State, Params>;
export declare function createActions<State, ActionsParams extends IActionsParams>(namespace: string, effects: IEffectMap<State, ActionsParams>): IThunkActionsMap<State, ActionsParams>;
export declare function prepareStore<State, ActionsParams extends IActionsParams>(initialState: State, effects: IEffectMap<State, ActionsParams>): IStoreCreator<State, ActionsParams>;
export declare function combineStores<StoresCreators>(storeCreators: StoresCreators): IPreparedStore<StoresCreators>;
