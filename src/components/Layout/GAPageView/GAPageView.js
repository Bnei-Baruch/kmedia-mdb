import React, { Component } from 'react';
import ReactGA from 'react-ga';

import { HistoryLocation } from '../../shapes';

class GAPageView extends Component {
  static sendPageChange = (pathname, search = '') => {
    const page = pathname + search;
    ReactGA.set({ page });
    ReactGA.pageview(page);
  };

  static getDerivedStateFromProps(nextProps, state) {
    const { location: { pathname, search } } = nextProps;

    // When props change, check if the URL has changed or not
    if (state.pathname !== nextProps.location.pathname) {
      GAPageView.sendPageChange(pathname, search);
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      pathname: '',
    };
  }

  componentDidMount() {
    // Initial page load - only fired once
    const { location: { pathname, search } } = this.props;
    GAPageView.sendPageChange(pathname, search);
    this.setState({ pathname });
  }

  render() {
    return <div />;
  }
}

GAPageView.propTypes = {
  location: HistoryLocation.isRequired
};

export default GAPageView;
