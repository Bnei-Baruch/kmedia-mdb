import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';

/**
 * Use this component instead of react-router-dom's NavLink to keep the current language in the destination route
 */

const NavLink = ({ activeClassName, activeStyle, active, ...props }) => (
  <Link
    {...props}
    className={clsx(`${props.className}`, { activeClassName: active })}
    style={{ ...props.style, ...(active ? activeStyle : null) }}
  />

);

export default NavLink;
