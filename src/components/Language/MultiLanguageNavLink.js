import React from 'react';
import { Link } from 'next/link';

/**
 * Use this component instead of react-router-dom's NavLink to keep the current language in the destination route
 */

const NavLink = ({ activeClassName, activeStyle, ...props }) => (
  <Link
    {...props}
    className={({ isActive }) =>
      [
        props.className,
        isActive ? activeClassName : null,
      ]
        .filter(Boolean)
        .join(' ')
    }
    style={({ isActive }) => ({
      ...props.style,
      ...(isActive ? activeStyle : null),
    })}
  />

);

export default NavLink;
