import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { getToWithLanguage } from "../../helpers/url";
import ClientLanguageNavLink from "./ClientLanguageNavLink";
import isString from "lodash/isString";

/**
 * Use this component instead of react-router-dom's NavLink to keep the current language in the destination route
 */

const NavLink = React.forwardRef(
  (
    {
      activeClassName,
      activeStyle,
      to = undefined,
      language ='',
      contentLanguage = undefined,
      staticContext,
      className = undefined,
      style = undefined,
      ...rest
    },
    ref
  ) => {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
      setIsClient(true);
    }, []);

    const location = useLocation();
    const toWithLanguage = getToWithLanguage(to, location, language, contentLanguage);

    if (isClient) {
      return <ClientLanguageNavLink to={toWithLanguage} {...rest} />;
    }
    const _className = [className, rest.active ? activeClassName : null].filter(Boolean).join(" ");
    const _style = { ...style, ...(rest.active ? activeStyle : null) };
    return (
      <a
        ref={ref}
        {...rest}
        href={isString(toWithLanguage) ? toWithLanguage : toWithLanguage.pathname}
        className={_className}
        style={_style}
      >
        {rest.children}
      </a>
    );
  }
);

export default NavLink;
