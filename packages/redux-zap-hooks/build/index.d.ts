import { IRootState, IThunkActionsMap } from 'redux-zap';
export { StoreContext, useDispatch } from 'redux-react-hook';
export declare const useMappedState: <RootState extends IRootState, Result>(mapState: (state: RootState) => Result) => Result;
export declare function useActions<State, ActionsParams>(actions: IThunkActionsMap<State, ActionsParams>): any;
