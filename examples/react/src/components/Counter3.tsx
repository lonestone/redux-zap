import { IConnectProps } from 'merdux'
import React from 'react'
import { connect } from 'react-redux'
import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { actions, IRootState } from '../store'

type IProps = IConnectProps<typeof mapStateToProps, typeof mapDispatchToProps>

class Counter3 extends React.Component<IProps> {
  public render() {
    const { reset, increment } = this.props
    return (
      <div>
        <button onClick={reset}>✖</button>
        <button onClick={() => increment(1)}>➕</button>
      </div>
    )
  }
}

const mapStateToProps = ({ counter }: IRootState) => ({ ...counter })
const mapDispatchToProps = (dispatch: ThunkDispatch<IRootState, undefined, Action>) => ({
  reset: () => dispatch(actions.counter.reset()),
  increment: (n: number) => dispatch(actions.counter.increment(n))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Counter3)
