import React from 'react';
import PropTypes from 'prop-types';
import { Trans, translate } from 'react-i18next';
import { Grid } from 'semantic-ui-react';

import Link from '../../Language/MultiLanguageLink';
import { formatError } from '../../../helpers/utils';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../shared/Splash';
import RMPVideoBox from '../../shared/UnitPlayer/RMPVideoBox';
import * as shapes from '../../shapes';
import Info from './Info';
import Materials from './Materials';
import MediaDownloads from './MediaDownloads';
import RelevantPartsContainer from './RelevantParts/RelevantPartsContainer';

const LessonPart = (props) => {
  const { lesson, wip, err, language, t } = props;

  if (err) {
    return <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
  }

  if (wip) {
    return <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
  }

  if (lesson) {
    return (
      <Grid.Column width={16}>
        <Grid>
          <RMPVideoBox unit={lesson} language={language} t={t} isSliceable />
        </Grid>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>
              <Info lesson={lesson} t={t} />
              <Materials lesson={lesson} t={t} />
            </Grid.Column>
            <Grid.Column width={6}>
              <MediaDownloads lesson={lesson} language={language} t={t} />
              <RelevantPartsContainer lesson={lesson} t={t} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Grid.Column>
    );
  }

  return (
    <FrownSplash
      text={t('messages.lesson-not-found')}
      subtext={
        <Trans i18nKey="messages.lesson-not-found-subtext">
          Try the <Link to="/lessons">lessons list</Link>...
        </Trans>
      }
    />
  );
};

LessonPart.propTypes = {
  lesson: shapes.LessonPart,
  language: PropTypes.string.isRequired,
  wip: shapes.WIP,
  err: shapes.Error,
  t: PropTypes.func.isRequired,
};

LessonPart.defaultProps = {
  lesson: null,
  wip: false,
  err: null,
};

export default translate()(LessonPart);
