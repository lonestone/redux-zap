import { IConnectProps } from 'redux-zap'
import React from 'react'
import { connect } from 'react-redux'
import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { actions, IRootState } from '../store'

type IProps = IConnectProps<typeof mapStateToProps, typeof mapDispatchToProps>

class Counter3 extends React.Component<IProps> {
  public render() {
    const { reset, increment, decrement } = this.props
    return (
      <div>
        <button onClick={reset}>✖</button>
        <button onClick={() => decrement(3)}>➖3</button>
        <button onClick={() => decrement(1)}>➖</button>
        <button onClick={increment}>➕</button>
      </div>
    )
  }
}

const mapStateToProps = ({ counter }: IRootState) => ({ ...counter })
const mapDispatchToProps = (dispatch: ThunkDispatch<IRootState, undefined, Action>) => ({
  reset: () => dispatch(actions.counter.reset()),
  increment: () => dispatch(actions.counter.increment()),
  decrement: (n: number) => dispatch(actions.counter.decrement(n))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Counter3)
