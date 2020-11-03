import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Container, Grid, Header } from 'semantic-ui-react';

import Helmets from '../../../../shared/Helmets/index';
import { UnitContainer, wrap as wrapContainer } from '../../../../Pages/Unit/Container';
import { wrap as wrapPage } from '../../../../Pages/Unit/Page';
import TranscriptionContainer from '../../../../Pages/Unit/widgets/UnitMaterials/Transcription/TranscriptionContainer';
import Share from "../../../Library/Share";
import { isLanguageRtl } from "../../../../../helpers/i18n-utils";
import MediaDownloads from '../../../../Pages/Unit/widgets/Downloads/MediaDownloads';
import * as shapes from '../../../../shapes';
import WipErr from '../../../../shared/WipErr/WipErr';
import Recommended from '../../../../Pages/Unit/widgets/Recommended/Main/Recommended';
import playerHelper from '../../../../../helpers/player';


const renderHeader = (unit, t, language) => {
  const isRtl = isLanguageRtl(language);
  const position = isRtl ? 'right' : 'left';
  const subText2 = t(`publications.header.subtext2`);

  return (
    <div className="section-header">
      <Container className="padded">
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Header as="h1">
                <Header.Content>
                  {unit.name}
                  {
                    unit.description
                      ? <Header.Subheader>{unit.description}</Header.Subheader>
                      : null
                  }
                  {
                    subText2
                      ? (
                        <Header.Subheader className="section-header__subtitle2">
                          {subText2}
                        </Header.Subheader>
                      )
                      : null
                  }
                </Header.Content>
              </Header>
              <Header as="h4" color="grey" className="display-inline">
                {t('values.date', { date: unit.film_date })}
              </Header>
              <span className="share-publication">
                <Share position={position} />
              </span>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
}

const renderHelmet = unit => (
  <Fragment>
    <Helmets.NoIndex />
    <Helmets.ArticleUnit unit={unit} />
  </Fragment>
);

const renderArticle = unit => (
  <Grid padded>
    <Grid.Row>
      <Grid.Column>	
        <TranscriptionContainer unit={unit} />
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column>
        <MediaDownloads unit={unit} displayDivider={true} />
      </Grid.Column> 
    </Grid.Row>
  </Grid>
);

const ArticlePage = ({ t, language, unit = null, location = {} }) => {
  if (!unit) {
    return null;
  }

  const embed = playerHelper.getEmbedFromQuery(location);

  return !embed ? (
    <div className="unit-page">
      {renderHelmet(unit)}
      <Container>
        <Grid padded>
          <Grid.Row>
            <Grid.Column mobile={16} tablet={10} computer={10}>
              <Grid.Row>
                {renderHeader(unit, t, language)}
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  {renderArticle(unit)}
                </Grid.Column>
              </Grid.Row>
            </Grid.Column>
            <Grid.Column mobile={16} tablet={6} computer={6}>	
              <Recommended unit={unit} />	
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  ) : (
    <div className="unit-page">
      {renderHeader(unit, t, language)}
    </div>
  );
}

ArticlePage.propTypes = {
  unit: shapes.ContentUnit,
  language: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  location: shapes.HistoryLocation,
};

class MyUnitContainer extends UnitContainer {
  render() {
    const { language, unit, wip, err, t } = this.props;

    const wipErr = WipErr({ wip, err, t });
    if (wipErr) {
      return wipErr;
    }

    return (
      <ArticlePage
        unit={unit}
        language={language}
        t={t}
      />
    );
  }
}

export default wrapContainer(wrapPage(MyUnitContainer));