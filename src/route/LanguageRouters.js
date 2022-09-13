import React, { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectors, actions } from '../redux/modules/settings';
import { LANGUAGES, DEFAULT_LANGUAGE } from '../helpers/consts';

const LanguageRouter = () => {
  const { lang: language } = useParams();
  const currentLanguage    = useSelector(state => selectors.getLanguage(state.settings));
  const dispatch           = useDispatch();

  useEffect(() => {
    if (language && language !== currentLanguage) {
      const actualLanguage = LANGUAGES[language] ? language : DEFAULT_LANGUAGE;
      dispatch(actions.setLanguage(actualLanguage));
    }
  }, [language, currentLanguage, dispatch]);

  return (
    <>
      <Outlet />
    </>
  );
};

export default LanguageRouter;
