import './asynciterator-polyfill';
import { IActionsParams, IPreparedStore, IStoreCreator, IZapsMap } from './interfaces';
export { IStateTransform, IZap, IZapReturn } from './interfaces';
export declare function setActionPrefix(prefix: string): void;
export declare function prepareStore<State, ActionsParams extends IActionsParams>(initialState: State, zaps: IZapsMap<State, ActionsParams>): IStoreCreator<State, ActionsParams>;
export declare function combineStores<StoresCreators extends Record<string, IStoreCreator<any, any>>>(storeCreators: StoresCreators): IPreparedStore<StoresCreators, { [namespace in keyof StoresCreators]: StoresCreators[namespace] extends IStoreCreator<infer State, any> ? State : never; }>;
