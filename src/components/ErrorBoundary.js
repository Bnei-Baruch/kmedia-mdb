import React from 'react';
import PropTypes from 'prop-types';

import logger from '../helpers/logger';

class ErrorBoundary extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired
  };

  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(/* error */) {
    // Update state so the next render will show the fallback UI.
    return null; // TODO { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    logger.error(error, info);
  }

  render() {
    const { hasError } = this.state;
    if (hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong. See console.</h1>;
    }

    const { children } = this.props;
    return children;
  }
}

export default ErrorBoundary;
