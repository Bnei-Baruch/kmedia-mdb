import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withNamespaces } from 'react-i18next';
import { Container, Grid } from 'semantic-ui-react';

import * as shapes from '../../shapes';
import Helmets from '../../shared/Helmets';
import WipErr from '../../shared/WipErr/WipErr';
import AVBox from './widgets/AVBox/AVBox';
import Materials from './widgets/UnitMaterials/Materials';
import Info from './widgets/Info/Info';
import MediaDownloads from './widgets/Downloads/MediaDownloads';
import Recommended from './widgets/Recommended/Main/Recommended';
import playerHelper from '../../../helpers/player';
import { MT_VIDEO } from '../../../helpers/consts';

export class UnitPage extends Component {
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
    this.state         = { embed: playerHelper.getEmbedFromQuery(location) };
  }

  renderHelmet() {
    const { unit, language } = this.props;
    return <Helmets.AVUnit unit={unit} language={language} />;
  }

  renderPlayer() {
    const { unit, language, location } = this.props;
    const { embed }                    = this.state;
    const mediaType                    = AVBox.getMediaType(location);

    return !embed 
      ? <div className="playlist-collection-page">
        <Container className="avbox">
          <Grid centered padded>
            <Grid.Row className={classNames('', {'layout--is-audio': false})} >
              <Grid.Column id="avbox__player" mobile={16} tablet={10} computer={10}>
                <AVBox unit={unit} language={language} />
              </Grid.Column>
              { mediaType === MT_VIDEO
                ? <Grid.Column id="avbox__playlist" className="avbox__playlist" mobile={16} tablet={6} computer={6}>
                  <Recommended unit={unit}/>
                </Grid.Column>
                : null
              }
            </Grid.Row>
          </Grid>
        </Container>
      </div>
      : <AVBox unit={unit} language={language} />
    ;
  }

  // renderRecommendations() {
  //   const { unit } = this.props;
  //   return <Recommended unit={unit}/>
  //   // return <MyWrappedSameCollectionContainer unit={unit} />;
  // }

  renderInfo() {
    const { unit, section } = this.props;
    return <Info unit={unit} section={section} />;
  }

  renderMaterials() {
    const { unit } = this.props;
    return <Materials unit={unit} />;
  }

  renderDownloads() {
    const { unit } = this.props;
    return <MediaDownloads unit={unit} />;
  }

  renderContent() {
    const { embed } = this.state;
    return !embed ? (
      <div className="unit-page">
        {this.renderHelmet()}
        {this.renderPlayer()}
        <Container>
          <Grid padded>
            <Grid.Row>
              <Grid.Column mobile={16} tablet={16} computer={11} className="content__main">
                {this.renderInfo()}
                {this.renderMaterials()}
              </Grid.Column>
              <Grid.Column mobile={16} tablet={16} computer={5} className="content__aside">
                <Grid>
                  <Grid.Row>
                    {/* <Grid.Column className="avbox__playlist" mobile={16} tablet={8} computer={16}>	
                      {this.renderRecommendations()}	
                    </Grid.Column> */}
                    <Grid.Column mobile={16} tablet={8} computer={16}>
                      {this.renderDownloads()}
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    ) : (
      <div className="unit-page">
        {this.renderPlayer()}
      </div>
    );
  }

  render() {
    const { unit, wip, err, t } = this.props;

    const wipErr = WipErr({ wip, err, t });
    if (wipErr) {
      return wipErr;
    }

    if (!unit) {
      return null;
    }

    return this.renderContent();
  }
}

export const wrap = WrappedComponent => withNamespaces()(WrappedComponent);

export default wrap(UnitPage);
