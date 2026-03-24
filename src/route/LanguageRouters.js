import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import { LANG_UI_LANGUAGES } from '../helpers/consts';
import { settingsGetUrlLangSelector } from '../redux/selectors';

const LanguageRouter = () => {
  const { lang: urlLang } = useParams();
  const location = useLocation();
  const origUrlLang = useSelector(settingsGetUrlLangSelector);

  if (urlLang && !LANG_UI_LANGUAGES.includes(urlLang)) {
    return <Navigate to={`/${origUrlLang}${location.pathname}`} replace />;
  }

  /*
  useEffect(() => {
    if (urlLang && LANG_UI_LANGUAGES.includes(urlLang)) {
      if (urlLang === uiLang && origUrlLang !== "") {
        // Clear URL language it is the same as UI language.
        updateHtmlLang(uiLang);
        dispatch(actions.setURLLanguage(""));
      } else if (origUrlLang !== urlLang && urlLang !== uiLang) {
        // Set URL language.
        updateHtmlLang(urlLang);
        dispatch(actions.setURLLanguage(urlLang));
      }
    }
  }, [origUrlLang, urlLang, uiLang, dispatch]);
  */

  return <Outlet />;
};

export default LanguageRouter;
