/**
 * This is copies almost AS IS from latest master of react-router
 * We need this as for its Redirect with params feature.
 *
 * By all means, remove this once a new version is available on npm.
 *
 * Edo
 */

import React from 'react';
import PropTypes from 'prop-types';
import warning from 'warning';
import invariant from 'invariant';
import { createLocation, locationsAreEqual } from 'history';
import pathToRegexp from 'path-to-regexp';
import * as shapes from '../shapes';

const patternCache = {};
const cacheLimit   = 10000;
let cacheCount     = 0;

const compileGenerator = (pattern) => {
  const cacheKey = pattern;
  const cache    = patternCache[cacheKey] || (patternCache[cacheKey] = {});

  if (cache[pattern]) {
    return cache[pattern];
  }

  const compiledGenerator = pathToRegexp.compile(pattern);

  if (cacheCount < cacheLimit) {
    cache[pattern] = compiledGenerator;
    cacheCount++;
  }

  return compiledGenerator;
};

/**
 * Public API for generating a URL pathname from a pattern and parameters.
 */
const generatePath = (pattern = '/', params = {}) => {
  if (pattern === '/') {
    return pattern;
  }
  const generator = compileGenerator(pattern);
  return generator(params);
};

/**
 * The public API for updating the location programmatically
 * with a component.
 */
class Redirect extends React.Component {
  static propTypes = {
    computedMatch: PropTypes.object, // private, from <Switch>
    push: PropTypes.bool,
    from: PropTypes.string,
    to: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]).isRequired
  };

  static defaultProps = {
    push: false
  };

  static contextTypes = {
    router: PropTypes.shape({
      history: shapes.History.isRequired,
      staticContext: PropTypes.object
    }).isRequired
  };

  componentWillMount() {
    invariant(
      this.context.router,
      'You should not use <Redirect> outside a <Router>'
    );

    if (this.isStatic()) {
      this.perform();
    }
  }

  componentDidMount() {
    if (!this.isStatic()) {
      this.perform();
    }
  }

  componentDidUpdate(prevProps) {
    const prevTo = createLocation(prevProps.to);
    const nextTo = createLocation(this.props.to);

    if (locationsAreEqual(prevTo, nextTo)) {
      warning(false, `You tried to redirect to the same route you're currently on: "${nextTo.pathname}${nextTo.search}"`);
      return;
    }

    this.perform();
  }

  computeTo({ computedMatch, to }) {
    if (computedMatch) {
      if (typeof to === 'string') {
        return generatePath(to, computedMatch.params);
      }

      return {
        ...to,
        pathname: generatePath(to.pathname, computedMatch.params)
      };
    }

    return to;
  }

  isStatic() {
    return this.context.router && this.context.router.staticContext;
  }

  perform() {
    const { history } = this.context.router;
    const { push }    = this.props;
    const to          = this.computeTo(this.props);

    if (push) {
      history.push(to);
    } else {
      history.replace(to);
    }
  }

  render() {
    return null;
  }
}

export default Redirect;
