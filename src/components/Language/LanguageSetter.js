import { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors } from '../../redux/modules/settings';
import { DEFAULT_LANGUAGE, LANGUAGES } from '../../helpers/consts';
import * as shapes from '../shapes';

// NOTE: yaniv -> edo: should we block rendering until language changed?

const catchLanguageChange = ({ language: newLanguage, setLanguage }) => {
  const actualLanguage = LANGUAGES[newLanguage] ? newLanguage : DEFAULT_LANGUAGE;
  setLanguage(actualLanguage);
};

const LanguageSetter = ({ language, children }) => {
  const currentLanguage = useSelector(state => selectors.getLanguage(state.settings));
  const dispatch        = useDispatch();
  const setLanguage     = useCallback(language => dispatch(actions.setLanguage(language)), [dispatch]);

  useEffect(() => {
    // catch language change only on client
    if (typeof window === 'undefined') {
      return;
    }

    if (language && language !== currentLanguage) {
      catchLanguageChange({ language, setLanguage });
    }
  }, [language, currentLanguage, setLanguage]);

  return children;
};

LanguageSetter.propTypes = {
  language: PropTypes.string,
  children: shapes.Children.isRequired,
};

export default LanguageSetter;
