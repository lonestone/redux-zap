import './asynciterator-polyfill';
import { GenericActionsParams, PreparedStore, StoreCreator, ZapsMap } from './interfaces';
export { StateTransform, Zap, ZapReturn } from './interfaces';
export declare function setActionPrefix(prefix: string): void;
export declare function prepareStore<State, ActionsParams extends GenericActionsParams>(initialState: State, zaps: ZapsMap<State, ActionsParams>): StoreCreator<State, ActionsParams>;
export declare function combineStores<StoresCreators extends Record<string, StoreCreator<any, any>>>(storeCreators: StoresCreators): PreparedStore<StoresCreators, { [namespace in keyof StoresCreators]: StoresCreators[namespace] extends StoreCreator<infer State, any> ? State : never; }>;
