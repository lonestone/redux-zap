import { IDispatchActionsMap, IRootState, IThunkActionsMap } from 'merdux'
import { useDispatch, useMappedState as useMappedStateBadlyTyped } from 'redux-react-hook'

export { StoreContext, useDispatch } from 'redux-react-hook'

export const useMappedState: <RootState extends IRootState, Result>(
  mapState: (state: RootState) => Result
) => Result = useMappedStateBadlyTyped

export function useActions<State, ActionsParams>(
  actions: IThunkActionsMap<State, ActionsParams>
) {
  const dispatch = useDispatch()
  return Object.keys(actions).reduce<IDispatchActionsMap<ActionsParams>>(
    (dispatchActions, name) => ({
      ...dispatchActions,
      [name]: (...params: any) => dispatch(actions[name](...params))
    }),
    {} as any
  )
}
