import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Container, Grid } from 'semantic-ui-react';

import * as shapes from '../../shapes';
import WipErr from '../../shared/WipErr/WipErr';
import AVBox from './widgets/AVBox/AVBox';
import Materials from './widgets/UnitMaterials/Materials';
import Info from './widgets/Info/Info';
import MediaDownloads from './widgets/Downloads/MediaDownloads';
import SameCollection from './widgets/Recommended/SameCollection/Container';

export class UnitPage extends Component {

  static propTypes = {
    unit: shapes.ProgramChapter,
    wip: shapes.WIP,
    err: shapes.Error,
    section: PropTypes.string,
    language: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    unit: null,
    wip: false,
    err: null,
    section: '',
  };

  renderPlayer() {
    const { unit, language, t } = this.props;
    return (
      <div className="avbox">
        <Container>
          <Grid centered padded>
            <AVBox unit={unit} language={language} t={t} />
          </Grid>
        </Container>
      </div>
    );
  }

  renderInfo() {
    const { unit, t, section } = this.props;
    return <Info unit={unit} section={section} t={t} />;
  }

  renderMaterials() {
    const { unit, t } = this.props;
    return <Materials unit={unit} t={t} />;
  }

  renderDownloads() {
    const { unit, language, t } = this.props;
    return <MediaDownloads unit={unit} language={language} t={t} />;
  }

  renderRecommendations() {
    const { unit, t, section } = this.props;
    return <SameCollection unit={unit} section={section} t={t} />;
  }

  renderContent() {
    return (
      <div>
        {this.renderPlayer()}
        <Container>
          <Grid padded reversed="tablet">
            <Grid.Row reversed="computer">
              <Grid.Column computer={6} tablet={8} mobile={16} className="content__aside">
                {this.renderDownloads()}
                {this.renderRecommendations()}
              </Grid.Column>
              <Grid.Column computer={10} tablet={8} mobile={16} className="content__main">
                {this.renderInfo()}
                {this.renderMaterials()}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
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

export const wrap = WrappedComponent => translate()(WrappedComponent);

export default wrap(UnitPage);
