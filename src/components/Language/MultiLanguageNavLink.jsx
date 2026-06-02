import React from 'react';
import { useLocation } from 'react-router';
import { NavLink as BaseNavLink } from 'react-router-dom';
import { getToWithLanguage } from '../../helpers/url';

/**
 * Use this component instead of react-router-dom's NavLink to keep the current language in the destination route
 */
/* eslint-disable react/display-name */
const NavLink = React.forwardRef(
  (
    {
      activeClassName,
      activeStyle,
      to = undefined,
      language = '',
      contentLanguage = undefined,
      // eslint-disable-next-line no-unused-vars
      staticContext: _staticContext,
      className = undefined,
      style = undefined,
      ...rest
    }, ref
  ) => {
    const location       = useLocation();
    const toWithLanguage = getToWithLanguage(to, location, language, contentLanguage);

    return <BaseNavLink
      ref={ref}
      {...rest}
      to={toWithLanguage}
      className={({ isActive }) =>
        [
          className,
          isActive ? activeClassName : null
        ]
          .filter(Boolean)
          .join(' ')
      }
      style={({ isActive }) => ({
        ...style,
        ...(isActive ? activeStyle : null)
      })}
    />;
  }
);

export default NavLink;
