import { useDispatch, useMappedState as useMappedStateBadlyTyped } from 'redux-react-hook'
import { IDispatchActionsMap, IRootState, IThunkActionsMap } from './interfaces'

export function useMappedState<RootState extends IRootState, Result>(
  mapState: (state: RootState) => Result
): Result {
  return useMappedStateBadlyTyped(mapState)
}

export function useActions<State, ActionsParams>(
  actions: IThunkActionsMap<State, ActionsParams>
) {
  const dispatch = useDispatch()
  return Object.keys(actions).reduce<IDispatchActionsMap<ActionsParams>>(
    (dispatchActions, name) => ({
      ...dispatchActions,
      [name]: (...params: any) => dispatch(actions[name](...params)) as any
    }),
    {} as any
  )
}
