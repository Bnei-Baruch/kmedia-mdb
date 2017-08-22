import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';
import { Link, withRouter } from 'react-router-dom';
import { prefixWithLanguage } from '../../helpers/language';

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



const multiLanguageLinkCreator = () => (WrappedComponent) => {
  class MultiLanguageLinkHOC extends Component {

    static propTypes = {
      ...Link.propTypes,
      to: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
      ]),
      location: PropTypes.object.isRequired,
      language: PropTypes.string // language shorthand, for example: "ru"
    };

    static defaultProps = {
      language: '',
      to: undefined
    };

    prefixWithLanguage = (path) => {
      const { location, language } = this.props;
      return prefixWithLanguage(path, location, language);
    };

    render() {
      const { to, language, location, match, history, staticContext, ...rest } = this.props;
      let navigateTo = to;
      let toWithLanguage;

      if (typeof navigateTo === 'string') {
        toWithLanguage = this.prefixWithLanguage(navigateTo);
      } else {
        if (!navigateTo) {
          navigateTo = location;
        }

        toWithLanguage = {
          ...navigateTo,
          pathname: this.prefixWithLanguage(navigateTo.pathname)
        };
      }

      return <WrappedComponent to={toWithLanguage} {...rest} />;
    }
  }

  return withRouter(hoistStatics(MultiLanguageLinkHOC, WrappedComponent));
};


export default multiLanguageLinkCreator;
