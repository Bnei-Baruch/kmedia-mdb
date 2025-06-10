import React from 'react';
import { Link as BaseLink } from 'react-router-dom';
import { useLocation } from 'react-router';
import { getToWithLanguage } from '../../helpers/url';

/**
 Use this component instead of react-router-dom's Link to keep the current language in the destination route

 There is a priority for how the active language after navigation is chosen (in descending order):
 1. the "language" prop
 2. the "to" prop contains a pathname that starts with a language's shorthand, for example: /ru/<Rest of url>,
 3. the current pathname's language shorthand if it exists in the pathname

 If you want to change the language, it is preferred to use the "language" prop instead of prefixing the pathname in the to prop.
 i.e - use <Component to="/some-path" language="ru" /> instead of <Component to="/ru/some-path" />

 */
const Link = (
  {
    to = undefined,
    language = '',
    contentLanguage = undefined,
    staticContext,
    ...rest
  }
) => {
  const location       = useLocation();
  const toWithLanguage = getToWithLanguage(to, location, language, contentLanguage);

  return <BaseLink to={toWithLanguage} {...rest} />;
};

export default Link;
