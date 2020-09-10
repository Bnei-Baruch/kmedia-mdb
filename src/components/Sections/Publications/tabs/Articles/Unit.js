import React, { Fragment, Component } from 'react';
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

class MyUnitPage extends Component {

  static propTypes = {
    unit: shapes.ContentUnit,
    wip: shapes.WIP,
    err: shapes.Error,
    section: PropTypes.string,
    language: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
    location: shapes.HistoryLocation,
  };

  static defaultProps = {
    unit: null,
    wip: false,
    err: null,
    section: '',
    location: {}
  };

  constructor(props) {
    super(props);
    const { location } = props;
    this.state         = { 
      embed: playerHelper.getEmbedFromQuery(location), 
    };
  }

  // render article title instead of player
  renderHeader() {
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

  renderHelmet() {
    return (
      <Fragment>
        <Helmets.NoIndex />
        <Helmets.ArticleUnit unit={this.props.unit} />
      </Fragment>
    );
  }

  // article content
  renderArticle() {
    const { unit } = this.props;

    return (
      <Grid vertically divided padded>
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

  renderContent() {
    const { unit } = this.props;
    const { embed } = this.state;

    return !embed ? (
      <div className="unit-page">
        {this.renderHelmet()}
        <Container>
          <Grid padded>
            <Grid.Row>
              <Grid.Column mobile={16} tablet={10} computer={10}>
                <Grid.Row>
                  {this.renderHeader()}
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    {this.renderArticle()}
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
        {this.renderHeader()}
      </div>
    );
  }

  render() {
    const { unit } = this.props;

    if (!unit) {
      return null;
    }

    return this.renderContent();
  }
}

// export const wrap = WrappedComponent => withNamespaces()(WrappedComponent);

const MyWrappedUnitPage = wrapPage(MyUnitPage);

class MyUnitContainer extends UnitContainer {
  render() {
    const { language, unit, wip, err, t } = this.props;

    const wipErr = WipErr({ wip, err, t });
    if (wipErr) {
      return wipErr;
    }

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

export default wrapContainer(wrapPage(MyUnitContainer));