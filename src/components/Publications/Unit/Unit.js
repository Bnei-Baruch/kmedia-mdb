import React from 'react';
import PropTypes from 'prop-types';
import { Trans, translate } from 'react-i18next';
import { Container, Grid, Header } from 'semantic-ui-react';

import { formatError } from '../../../helpers/utils';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../shared/Splash';
import * as shapes from '../../shapes';
import TranscriptionContainer from '../../shared/UnitMaterials/Transcription/TranscriptionContainer';
import MediaDownloads from '../../shared/MediaDownloads';
import Link from '../../Language/MultiLanguageLink';
import RelevantPartsContainer from './RelevantParts/RelevantPartsContainer';

const PublicationUnit = (props) => {
  const { unit, wip, err, language, t } = props;

  if (err) {
    if (err.response && err.response.status === 404) {
      return (
        <FrownSplash
          text={t('messages.publication-not-found')}
          subtext={
            <Trans i18nKey="messages.publication-not-found-subtext">
              Try the <Link to="/publications">publications list</Link>...
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

  if (!unit) {
    return null;
  }

  return (
    <div>
      <div className="section-header">
        <Container className="padded">
          <Grid>
            <Grid.Row>
              <Grid.Column>
                <Header as="h1">
                  <Header.Content>
                    {unit.name}
                    {
                      unit.description ?
                        <Header.Subheader>{unit.description}</Header.Subheader> :
                        null
                    }
                  </Header.Content>
                </Header>
                <Header as="h4" color="grey">
                  {t('values.date', { date: new Date(unit.film_date) })}
                </Header>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
      <Container>
        <Grid padded>
          <Grid.Row>
            <Grid.Column width={10}>
              <TranscriptionContainer unit={unit} t={t} />
            </Grid.Column>
            <Grid.Column width={6}>
              <MediaDownloads unit={unit} language={language} t={t} />
              <RelevantPartsContainer unit={unit} t={t} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
};

PublicationUnit.propTypes = {
  unit: shapes.Article,
  language: PropTypes.string.isRequired,
  wip: shapes.WIP,
  err: shapes.Error,
  t: PropTypes.func.isRequired,
};

PublicationUnit.defaultProps = {
  unit: null,
  wip: false,
  err: null,
};

export default translate()(PublicationUnit);
