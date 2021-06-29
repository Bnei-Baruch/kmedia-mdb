import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';

import { ErrorSplash, FrownSplash, LoadingSplash } from './Splash/Splash';

const Loading = (props) => {
  const { error = false, timedOut = false, pastDelay = false, retry = null, t } = props;
  if (error) {
    return <ErrorSplash text={t('messages.error')} item={<button onClick={retry} type="button">{t('messages.retry')}</button>} />;
  }

  if (timedOut) {
    return <FrownSplash text={t('messages.timeout')} item={<button onClick={retry} type="button">{t('messages.retry')}</button>} />;
  }

  if (pastDelay) {
    return <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
  }

  return <Fragment />;
};

Loading.propTypes = {
  t: PropTypes.func.isRequired,
  error: PropTypes.bool,
  timedOut: PropTypes.bool,
  pastDelay: PropTypes.bool,
  retry: PropTypes.func,
};

export default withNamespaces()(Loading);
