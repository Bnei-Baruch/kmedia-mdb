import React, { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { actions } from '../redux/modules/settings';
import { LANG_UI_LANGUAGES } from '../helpers/consts';
import { updateHtmlLang } from '../helpers/language';
import { settingsGetUILangSelector, settingsGetUrlLangSelector } from '../redux/selectors';

const LanguageRouter = () => {
  const { lang: urlLang } = useParams();
  const origUrlLang       = useSelector(settingsGetUrlLangSelector);
  const uiLang            = useSelector(state => settingsGetUILangSelector(state, true /* skipUrl */));
  const dispatch          = useDispatch();

  useEffect(() => {
    if (urlLang && LANG_UI_LANGUAGES.includes(urlLang)) {
      if (urlLang === uiLang && origUrlLang !== '') {
        // Clear URL language it is the same as UI language.
        updateHtmlLang(uiLang);
        dispatch(actions.setURLLanguage(''));
      } else if (origUrlLang !== urlLang && urlLang !== uiLang) {
        // Set URL language.
        updateHtmlLang(urlLang);
        dispatch(actions.setURLLanguage(urlLang));
      }
    }
  }, [origUrlLang, urlLang, uiLang, dispatch]);

  return (
    <>
      <Outlet/>
    </>
  );
};

export default LanguageRouter;
