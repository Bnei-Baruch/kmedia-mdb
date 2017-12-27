import React from 'react';
import PropTypes from 'prop-types';
import { Trans, translate } from 'react-i18next';
import { Container, Grid } from 'semantic-ui-react';

import { formatError } from '../../../helpers/utils';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../shared/Splash';
import * as shapes from '../../shapes';
import RMPVideoBox from '../../shared/UnitPlayer/RMPVideoBox';
import Materials from '../../shared/UnitMaterials/Materials';
import MediaDownloads from '../../shared/MediaDownloads';
import Link from '../../Language/MultiLanguageLink';
import Info from './Info';
import RelevantPartsContainer from './RelevantParts/RelevantPartsContainer';

const LessonPart = (props) => {
  const { lesson, wip, err, language, t } = props;

  if (err) {
    if (err.response && err.response.status === 404) {
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
    }

    return <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
  }

  if (wip) {
    return <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
  }

  if (!lesson) {
    return null;
  }

  return (
    <div>
      <div className="avbox">
        <Container>
          <Grid centered padded>
            <RMPVideoBox unit={lesson} language={language} t={t} isSliceable />
          </Grid>
        </Container>
      </div>
      <Container>
        <Grid padded reversed="tablet">
          <Grid.Row reversed="computer">
            <Grid.Column computer={6} tablet={8} mobile={16}  className='content__aside'>
              <MediaDownloads unit={lesson} language={language} t={t} />
              <RelevantPartsContainer unit={lesson} t={t} />
            </Grid.Column>
            <Grid.Column computer={10} tablet={8} mobile={16} className='content__main'>
              <Info lesson={lesson} t={t} />
              <Materials unit={lesson} t={t} />
            </Grid.Column>
            
          </Grid.Row>
        </Grid>
      </Container>
    </div>
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
