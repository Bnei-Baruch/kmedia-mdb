import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors } from '../../redux/modules/settings';
import { DEFAULT_LANGUAGE, LANGUAGES } from '../../helpers/consts';
import * as shapes from '../shapes';

// NOTE: yaniv -> edo: should we block rendering until language changed?

const LanguageSetter = ({ language, children }) => {
  const currentLanguage = useSelector(state => selectors.getLanguage(state.settings));
  const dispatch        = useDispatch();

  useEffect(() => {
    // catch language change only on client
    if (typeof window === 'undefined') {
      return;
    }

    if (language && language !== currentLanguage) {
      const actualLanguage = LANGUAGES[language] ? language : DEFAULT_LANGUAGE;
      dispatch(actions.setLanguage(actualLanguage));
    }
  }, [language, currentLanguage, dispatch]);

  return children;
};

LanguageSetter.propTypes = {
  language: PropTypes.string,
  children: shapes.Children.isRequired,
};

export default LanguageSetter;
