import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { LANGUAGES } from '../../helpers/consts';
import { isAbsoluteUrl } from '../../helpers/utils';

const ensureStartsWithSlash = str => str && (str[0] === '/' ? str : `/${str}`);
const splitLanguagePath = (path) => {
  const pathWithSlash = ensureStartsWithSlash(path);
  const parts = pathWithSlash.split('/');

  if (LANGUAGES[parts[1]]) {
    return {
      language: parts[1],
      path: ensureStartsWithSlash(parts.slice(2).join('/')) || '/'
    };
  }

  return {
    path: pathWithSlash
  };
};

class MultiLanguageLink extends Component {

  static propTypes = {
    ...Link.propTypes,
    to: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    location: PropTypes.object.isRequired,
    language: PropTypes.string
  };

  static defaultProps = {
    language: '',
    to: undefined
  };

  prefixWithLanguage = (path) => {
    // NOTE: (yaniv) this assumes we don't use Link with an absolute url to kmedia - might need to fix this
    if (isAbsoluteUrl(path)) {
      return path;
    }

    const { location, language: propLanguage } = this.props;
    const { language: languagePrefix, path: pathSuffix } = splitLanguagePath(path);
    const { language: currentPathLangPrefix } = splitLanguagePath(location.pathname);

    // priority: language from props > language from link path > language from current path
    const language = propLanguage || languagePrefix || currentPathLangPrefix || '';
    return language ? `/${language}${pathSuffix}` : pathSuffix;
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

    return <Link to={toWithLanguage} {...rest} />;
  }
}

export default withRouter(MultiLanguageLink);
