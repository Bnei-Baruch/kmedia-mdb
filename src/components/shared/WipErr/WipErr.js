import React from 'react';
import PropTypes from 'prop-types';

import * as shapes from '../../shapes';
import { formatError } from '../../../helpers/utils';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../Splash/Splash';

const WipErr = (props) => {
  const { wip, err, t } = props;

  if (err) {
    if (err.response && err.response.status === 404) {
      return <FrownSplash text={t('messages.not-found')} subtext={t('messages.not-found-subtext')} />;
    }

    return <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
  }

  if (wip) {
    return <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
  }

  return null;
};

WipErr.propTypes = {
  wip: shapes.WIP,
  err: shapes.Error,
  t: PropTypes.func.isRequired,
};

WipErr.defaultProps = {
  wip: false,
  err: null,
};

export default WipErr;
