import * as React from 'react';

interface IState {
  timeoutFired: boolean;
}

export interface IStateProps {
  error: string;
  loaded: boolean;
}
export interface IDispatchProps {
  load: () => void;
}

export default <TProps extends {}>(Component: React.ComponentType<TProps>) =>

  class Loading extends React.Component<IStateProps & IDispatchProps & TProps, IState> {
    public static displayName = `loading(${Component.displayName || Component.name})`;
    private timeout: NodeJS.Timer;

    constructor(props: IStateProps & IDispatchProps & TProps) {
        super(props);
        this.state = {
            timeoutFired: false
        };
    }

    public componentDidMount() {
      this.timeout = setTimeout(() => this.setState({timeoutFired: true}), 500);
      if (!this.props.loaded) {
        this.props.load();
      }
    }

    public componentWillUnmount() {
      clearTimeout(this.timeout);
    }

    public render() {
      if (this.props.loaded) {
        return (
          <Component {...this.props} />
        );
      }
      else if (this.props.error && this.props.error.length > 0) {
        return (
          <div>Error: {this.props.error}</div>
        )
      }
      else if (this.state.timeoutFired) {
        return (
          <div>Loading...</div>
        )
      }
      else {
        return null;
      }
    }
  }
