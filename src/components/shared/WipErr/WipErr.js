import React from 'react';
import PropTypes from 'prop-types';

import * as shapes from '../../shapes';
import { formatError } from '../../../helpers/utils';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../Splash/Splash';

const errorStatusNotFound = err => err.response?.status === 404;

const serverErrorSplash = (err, t) => <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
export const wipLoadingSplash = t => <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
export const frownSplashContentNotFound = t => <FrownSplash text={t('messages.source-content-not-found')} />;
export const frownSplashNotFound = t => <FrownSplash text={t('messages.not-found')} subtext={t('messages.not-found-subtext')} />

export const getSourceErrorSplash = (err, t) =>
  err && (
    errorStatusNotFound(err)
      ? frownSplashContentNotFound(t)
      : serverErrorSplash(err, t)
  )

const WipErr = ({ wip = false, err = null, t }) => {
  if (err) {
    return errorStatusNotFound(err)
      ? frownSplashNotFound(t)
      : serverErrorSplash(err, t);
  }

  if (wip) {
    return wipLoadingSplash(t);
  }

  return null;
};

WipErr.propTypes = {
  wip: shapes.WIP,
  err: shapes.Error,
  t: PropTypes.func.isRequired,
};

export default WipErr;
