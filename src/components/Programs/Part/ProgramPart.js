import React from 'react';
import PropTypes from 'prop-types';
import { Trans, translate } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';

import { formatError } from '../../../helpers/utils';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../shared/Splash';
import * as shapes from '../../shapes';
import Info from './Info';
import Materials from './Materials';
import VideoBox from './VideoBox';
import MediaDownloads from './MediaDownloads';
import RelevantPartsContainer from './RelevantParts/RelevantPartsContainer';

const ProgramPart = (props) => {
  const { program, wip, err, language, t } = props;

  if (err) {
    return <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
  }

  if (wip) {
    return <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
  }

  if (program) {
    return (
      <Grid.Column width={16}>
        <Grid>
          <VideoBox program={program} language={language} t={t} />
        </Grid>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>
              <Info program={program} t={t} />
              <Materials program={program} t={t} />
            </Grid.Column>
            <Grid.Column width={6}>
              <MediaDownloads program={program} language={language} t={t} />
              <RelevantPartsContainer program={program} t={t} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Grid.Column>
    );
  }

  return (
    <FrownSplash
      text={t('messages.program-not-found')}
      subtext={
        <Trans i18nKey="messages.program-not-found-subtext">
          Try the <Link to="/programs">programs list</Link>...
        </Trans>
      }
    />
  );
};

ProgramPart.propTypes = {
  program: shapes.ProgramPart,
  language: PropTypes.string.isRequired,
  wip: shapes.WIP,
  err: shapes.Error,
  t: PropTypes.func.isRequired,
};

ProgramPart.defaultProps = {
  program: null,
  wip: false,
  err: null,
};

export default translate()(ProgramPart);
