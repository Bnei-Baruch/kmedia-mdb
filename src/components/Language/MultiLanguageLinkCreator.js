import React from 'react';
import PropTypes from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';

import { stringify } from '../../helpers/url';

import { parse } from 'qs';
import { omit } from 'lodash/object';
import { KC_SEARCH_KEY_SESSION, KC_SEARCH_KEYS } from '../../../pkg/ksAdapter/adapter';

/**
 * multiLanguageLinkCreator - an higher order component to create a link that allows navigating
 * while keeping the current active language in the url, or changing to a new language on navigation.
 *
 * The wrapped component will keep most of the react-router-dom Link interface, with the following changes:
 * - it adds a language prop to the wrapped component if you need to force a language to the specific route.
 * - the "to" prop is not required like react-router-dom Link does, instead, if it is not supplied it will use the current location.
 *
 * There is a priority for how the active language after navigation is chosen (in descending order):
 * 1. the "language" prop
 * 2. the "to" prop contains a pathname that starts with a language's shorthand, for example: /ru/<Rest of url>,
 * 3. the current pathname's language shorthand if it exists in the pathname
 *
 * If you want to change the language, it is preferred to use the "language" prop instead of prefixing the pathname in the to prop.
 * i.e - use <Component to="/some-path" language="ru" /> instead of <Component to="/ru/some-path" />
 */

const multiLanguageLinkCreator = () => WrappedComponent => {
  const MultiLanguageLinkHOC = (
    {
      to = undefined,
      language = '',
      contentLanguage = undefined,
      staticContext,
      ...rest
    }
  ) => {

    // We need to use "unused constants" in order to get proper "rest"
    //const location       = useLocation();
    const toWithLanguage = to;//getToWithLanguage(to, location, language, contentLanguage);

    // Clear keycloak hash params from url
    if (toWithLanguage?.hash && toWithLanguage.hash.indexOf(KC_SEARCH_KEY_SESSION) !== -1) {
      const h             = toWithLanguage.hash.startsWith('#') ? toWithLanguage.hash.substr(1) : toWithLanguage.hash;
      toWithLanguage.hash = stringify(omit(parse(h), KC_SEARCH_KEYS));
    }

    return <WrappedComponent to={toWithLanguage} {...rest} />;
  };

  MultiLanguageLinkHOC.propTypes = {
    to: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    language: PropTypes.string, // language shorthand, for example: "ru"
    contentLanguage: PropTypes.string, // language shorthand, for example: "ru"
  };
  //TODO David: I dont see that we use any static methods on MultiLanguageLinkHOC (except propTypes)
  // so can we remove it?
  // https://reactjs.org/docs/higher-order-components.html#static-methods-must-be-copied-over

  return hoistStatics(MultiLanguageLinkHOC, WrappedComponent);
};

export default multiLanguageLinkCreator;
