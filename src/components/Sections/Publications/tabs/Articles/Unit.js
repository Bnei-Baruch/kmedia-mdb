import React, { Fragment } from 'react';
import { Container, Grid, Header } from 'semantic-ui-react';

import Helmets from '../../../../shared/Helmets/index';
import { UnitContainer, wrap as wrapContainer } from '../../../../Pages/Unit/Container';
import { UnitPage, wrap as wrapPage } from '../../../../Pages/Unit/Page';
import TranscriptionContainer from '../../../../Pages/Unit/widgets/UnitMaterials/Transcription/TranscriptionContainer';
import Share from "../../../Library/Share";
import { isLanguageRtl } from "../../../../../helpers/i18n-utils";
import MediaDownloads from '../../../../Pages/Unit/widgets/Downloads/MediaDownloads';

class MyUnitPage extends UnitPage {

  // render article title instead of player
  renderPlayer() {
    const { unit, t, language } = this.props;
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

  renderInfo() {
    return null;
  }

  renderHelmet() {
    return (
      <Fragment>
        <Helmets.NoIndex />
        <Helmets.ArticleUnit unit={this.props.unit} />
      </Fragment>
    );
  }

  // article content
  renderMaterials() {
    const { unit } = this.props;

    return (
      <Grid>
        <Grid.Row>
          <Grid.Column>	
            <TranscriptionContainer unit={unit} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <MediaDownloads unit={unit} displayTitle={true} />
          </Grid.Column> 
        </Grid.Row>
      </Grid>
    );
  }
}

const MyWrappedUnitPage = wrapPage(MyUnitPage);

class MyUnitContainer extends UnitContainer {
  render() {
    const { language, unit, wip, err } = this.props;
    return (
      <MyWrappedUnitPage
        section="publications"
        unit={wip || err ? null : unit}
        language={language}
        wip={wip}
        err={err}
      />
    );
  }
}

export default wrapContainer(MyUnitContainer);