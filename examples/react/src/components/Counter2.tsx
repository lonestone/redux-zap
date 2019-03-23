import { IConnectProps } from 'merdux'
import React from 'react'
import { connect } from 'react-redux'
import { actions, IRootState } from '../store'

type IProps = IConnectProps<typeof mapStateToProps, typeof mapDispatchToProps>

class Counter2 extends React.Component<IProps> {
  public render() {
    const { count, counting, reset, increment, incrementAsync, decrement } = this.props
    return (
      <div>
        <p>Count: {count}</p>
        <button onClick={reset}>✖</button>
        <button onClick={decrement}>➖</button>
        <button onClick={() => increment(1)}>➕</button>
        <button onClick={() => increment(3)}>➕3</button>
        <button onClick={incrementAsync}>➕5{counting && '⏳'}</button>
      </div>
    )
  }
}

const mapStateToProps = ({ counter }: IRootState) => ({ ...counter })
const mapDispatchToProps = actions.counter

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Counter2)
