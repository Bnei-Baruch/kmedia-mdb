import React from 'react';
import { Link as BaseLink } from 'react-router-dom';

const ClientLanguageLink = (
  {
    to,
    language,
    contentLanguage,
    staticContext,
    ...rest
  }
) => (<BaseLink to={to} {...rest} />);

export default ClientLanguageLink;
