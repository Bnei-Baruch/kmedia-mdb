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
import Recommended from './widgets/Recommended/Main/Recommended';
import playerHelper from '../../../helpers/player';

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
    this.state         = { 
      embed: playerHelper.getEmbedFromQuery(location), 
      // displayRecommended: true 
    };
  }

  renderHelmet() {
    const { unit, language } = this.props;
    return <Helmets.AVUnit unit={unit} language={language} />;
  }

  renderPlayer() {
    const { unit, language } = this.props;
    const { embed }          = this.state;

    return (!embed 
      ? <div className="playlist-collection-page">
        <Container className="avbox">
          <Grid>
            <Grid.Row className={classNames('', {'layout--is-audio': false})} >
              <Grid.Column id="avbox__player">
                <AVBox unit={unit} language={language} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
      : <AVBox unit={unit} language={language} />
    );
  }

  // displayRecommendedHandler = (displayRecommended) => {
  //   this.setState({ displayRecommended });
  // }

  renderRecommendations() {
    const { unit } = this.props;
    return <Recommended unit={unit} />;
    // displayHandler={this.displayRecommendedHandler.bind(this)} />;
  }

  renderInfo() {
    const { unit, section } = this.props;
    return <Info unit={unit} section={section} />;
  }

  renderMaterials() {
    const { unit } = this.props;
    return <Materials unit={unit} />;
  }

  renderContent() {
    const { embed } = this.state;
    // const computerWidth = displayRecommended ? 10 : 16;
    // console.log('displayRecommended:', displayRecommended);

    return !embed ? (
      <div className="unit-page">
        {this.renderHelmet()}
        <Container>
          <Grid padded>
            <Grid.Row>
              <Grid.Column mobile={16} tablet={10} computer={10}>
                <Grid.Row>
                  {this.renderPlayer()}
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    {this.renderInfo()}
                    {this.renderMaterials()}
                  </Grid.Column>
                </Grid.Row>
              </Grid.Column>
              <Grid.Column mobile={16} tablet={6} computer={6}>	
                {/* {displayRecommended &&  */}
                {this.renderRecommendations()}	
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
