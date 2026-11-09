import { useTranslation } from 'react-i18next';
import Helmets from './Helmets';
import { frownSplashNotFound } from './WipErr/WipErr';

// Catch-all route. The server answers 404 for it (see renderSSR); noindex is a fallback for client-side navigation.
const PageNotFound = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmets.Basic title={t('messages.not-found')} />
      <Helmets.NoIndex />
      {frownSplashNotFound(t)}
    </>
  );
};

export default PageNotFound;
