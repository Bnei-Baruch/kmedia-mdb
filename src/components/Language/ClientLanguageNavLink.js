import React from 'react';
import { NavLink as BaseNavLink } from 'react-router-dom';

const ClientLanguageNavLink = React.forwardRef(
  (
    {
      activeClassName,
      activeStyle,
      to = undefined,
      language = '',
      className = undefined,
      style = undefined,
      ...rest
    }, ref
  ) => (
    <BaseNavLink
      ref={ref}
      {...rest}
      to={to}
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
    />
  )
);

export default ClientLanguageNavLink;
