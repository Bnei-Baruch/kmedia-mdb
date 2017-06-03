import React, { Component } from 'react';

const dataLoader = (propsToPromise) => (WrappedComponent) => {
    return class DataLoader extends Component {
        state = {
            loading: true,
            error: null,
        };

        componentDidMount() {
            this.loadData();
        }

        componentWillReceiveProps(nextProps) {
            this.loadData();
        }

        loadData = () => {
          this.setState({ loading: true });
          propsToPromise(this.props)
            .then(props => this.setState(props))
            .catch(error => this.setState({ error, loading: false }));
        }

        render() {
            return (
                <WrappedComponent {...this.state}
                                  {...this.props} />
            );
        }
    };
};

export default dataLoader;
