import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors } from '../../redux/modules/settings';
import { DEFAULT_LANGUAGE, LANGUAGES } from '../../helpers/consts';
import { useParams } from 'react-router-dom';

const LanguageSetter = () => {
  const { lang: language } = useParams();
  const currentLanguage    = useSelector(state => selectors.getLanguage(state.settings));
  const dispatch           = useDispatch();

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

  return null;
};

export default LanguageSetter;
