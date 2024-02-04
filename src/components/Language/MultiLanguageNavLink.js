import React from 'react';
import { NavLink as BaseNavLink } from 'react-router-dom';
import { useLocation } from 'react-router';
import { getToWithLanguage } from '../../helpers/url';

/**
 * Use this component instead of react-router-dom's NavLink to keep the current language in the destination route
 */

const NavLink = React.forwardRef(
  (
    {
      activeClassName,
      activeStyle,
      to = undefined,
      language = '',
      contentLanguage = undefined,
      staticContext,
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
