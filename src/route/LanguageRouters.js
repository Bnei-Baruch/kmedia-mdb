import React, { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectors, actions } from '../redux/modules/settings';
import { LANG_UI_LANGUAGES } from '../helpers/consts';

const LanguageRouter = () => {
  const { lang: urlLang } = useParams();
  const origUrlLang       = useSelector(state => selectors.getUrlLang(state.settings));
  const uiLang            = useSelector(state => selectors.getUILang(state.settings, true /* skipUrl */));
  const dispatch          = useDispatch();

  useEffect(() => {
    console.log('LanguageRouters', origUrlLang, urlLang, uiLang)
    if (urlLang && LANG_UI_LANGUAGES.includes(urlLang)) {
      if (urlLang === uiLang && origUrlLang !== '') {
        // Clear URL language it is the same as UI language.
        dispatch(actions.setUrlLanguage(''));
      } else if (origUrlLang !== urlLang && urlLang !== uiLang) {
        // Set URL language.
        dispatch(actions.setUrlLanguage(urlLang));
      }
    }
  }, [origUrlLang, urlLang, uiLang, dispatch]);

  return (
    <>
      <Outlet />
    </>
  );
};

export default LanguageRouter;
