import React from 'react';
import { Route, Routes } from 'react-router-dom';
import routes from './routes';
import HomePage from '../components/Sections/Home/HomePage';

const KmediaRouters = () => {
  /*const p = useParams();
  const { lang: language } = p;
  const currentLanguage    = useSelector(state => selectors.getLanguage(state.settings));
  const dispatch           = useDispatch();

  useEffect(() => {
    if (language && language !== currentLanguage) {
      const actualLanguage = LANGUAGES[language] ? language : DEFAULT_LANGUAGE;
      dispatch(actions.setLanguage(actualLanguage));
    }
  }, [language, currentLanguage, dispatch]);
*/
  return (
    <Routes>
      <Route element={<HomePage />} path="/" key="route_home_page" />;
      {
        routes.map(({ path, component }, i) => {
            return <Route element={component} path={path} key={`route_${i}`} />;
          }
        )
      }
    </Routes>
  );
};

export default KmediaRouters;
