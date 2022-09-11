import React from 'react';
import { NavLink as BaseNavLink } from 'react-router-dom';
import multiLanguageLinkCreator from './MultiLanguageLinkCreator';

/**
 * Use this component instead of react-router-dom's NavLink to keep the current language in the destination route
 */

const NavLink = React.forwardRef(
  ({ activeClassName, activeStyle, ...props }, ref) => {
    return (
      <BaseNavLink
        ref={ref}
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
  }
);

export default multiLanguageLinkCreator()(NavLink);
