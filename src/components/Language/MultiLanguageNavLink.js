import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import Link from './MultiLanguageLink';


// FIXME: (yaniv) this does not work! does not render anything

// Taken from:
// https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/modules/NavLink.js

// We just use our link instead of react-router's link

/**
 * A <Link> wrapper that knows if it's "active" or not.
 */
const MultiLanguageNavLink = ({
  to,
  exact,
  strict,
  location,
  activeClassName,
  className,
  activeStyle,
  style,
  isActive: getIsActive,
  ariaCurrent,
  ...rest
}) => (
  <Route
    path={typeof to === 'object' ? to.pathname : to}
    exact={exact}
    strict={strict}
    location={location}
    children={({ location, match }) => {
      const isActive = !!(getIsActive ? getIsActive(match, location) : match);

      return (
        <Link
          to={to}
          className={isActive ? [className, activeClassName].filter(i => i).join(' ') : className}
          style={isActive ? { ...style, ...activeStyle } : style}
          aria-current={isActive && ariaCurrent}
          {...rest}
        />
      );
    }}
  />
);

MultiLanguageNavLink.propTypes = {
  to: Link.propTypes.to,
  exact: PropTypes.bool,
  strict: PropTypes.bool,
  location: PropTypes.object,
  activeClassName: PropTypes.string,
  className: PropTypes.string,
  activeStyle: PropTypes.object,
  style: PropTypes.object,
  isActive: PropTypes.func,
  ariaCurrent: PropTypes.oneOf(['page', 'step', 'location', 'true'])
};

MultiLanguageNavLink.defaultProps = {
  activeClassName: 'active',
  ariaCurrent: 'true'
};

export default MultiLanguageNavLink;
