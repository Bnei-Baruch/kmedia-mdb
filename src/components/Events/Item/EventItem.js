import React from 'react';
import PropTypes from 'prop-types';
import { Trans, translate } from 'react-i18next';
import { Grid } from 'semantic-ui-react';

import { formatError } from '../../../helpers/utils';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../shared/Splash';
import Link from '../../Language/MultiLanguageLink';
import RMPVideoBox from '../../shared/UnitPlayer/RMPVideoBox';
import * as shapes from '../../shapes';

const EventItem = (props) => {
  const { item, wip, err, language, t } = props;

  if (err) {
    return <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
  }

  if (wip) {
    return <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
  }

  if (item) {
    return (
      <Grid.Column width={16}>
        <RMPVideoBox unit={item} language={language} t={t} />
      </Grid.Column>
    );
  }

  return (
    <FrownSplash
      text={t('messages.event-item-not-found')}
      subtext={
        <Trans i18nKey="messages.event-item-not-found-subtext">
          Try the <Link to="/events">Events list</Link>...
        </Trans>
      }
    />
  );
};

EventItem.propTypes = {
  item: shapes.ProgramChapter,
  language: PropTypes.string.isRequired,
  wip: shapes.WIP,
  err: shapes.Error,
  t: PropTypes.func.isRequired,
};

EventItem.defaultProps = {
  item: null,
  wip: false,
  err: null,
};

export default translate()(EventItem);
