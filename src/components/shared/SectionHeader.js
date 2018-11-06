import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';
import { Container, Grid, Header, Menu } from 'semantic-ui-react';

import * as shapes from '../shapes';
import { selectors as device } from '../../redux/modules/device';
import WrappedOmniBox from '../../components/Search/OmniBox';
import Helmets from './Helmets';

class SectionHeader extends Component {

  static propTypes = {
    section: PropTypes.string.isRequired,
    submenuItems: PropTypes.arrayOf(PropTypes.node),
    t: PropTypes.func.isRequired,
    location: shapes.HistoryLocation.isRequired,
    deviceInfo: shapes.UserAgentParserResults.isRequired,
  };

  static defaultProps = {
    submenuItems: [],
  };

  isMobileDevice = () =>
    this.props.deviceInfo.device && this.props.deviceInfo.device.type === 'mobile';

  renderSearch = () => {
    const { t, location } = this.props;
    return location ? <WrappedOmniBox t={t} location={location} /> : null;
  };

  renderTitle = (title, subText) => {
    const { submenuItems } = this.props;

    return (<Grid>
      <Grid.Row>
        <Grid.Column computer={10} tablet={12} mobile={16}>
          <Header as="h1" color="blue">
            <Header.Content>
                  <span className="section-header__title">
                    {title}
                  </span>
              {
                subText ?
                  <Header.Subheader className="section-header__subtitle">
                    {subText}
                  </Header.Subheader>
                  : null
              }
            </Header.Content>
          </Header>
        </Grid.Column>
      </Grid.Row>
      {
        Array.isArray(submenuItems) && submenuItems.length > 0 ?
          <Grid.Row>
            <Grid.Column>
              <Menu tabular className="section-header__menu" size="huge">
                {submenuItems}
              </Menu>
            </Grid.Column>
          </Grid.Row> :
          null
      }
    </Grid>);
  };

  render() {
    const { section, t } = this.props;

    const title   = t(`${section}.header.text`);
    const subText = t(`${section}.header.subtext`);

    return (
      <div className="section-header">
        {/* TODO: dont use image fixed url */}
        <Helmets.Basic title={title} description={subText} />

        <Container className="padded">
          {this.isMobileDevice() ? this.renderSearch() : this.renderTitle(title, subText)}
        </Container>
      </div>
    );
  };
}

const mapState = (state) => {
  return {
    deviceInfo: device.getDeviceInfo(state.device),
  };
};

export default connect(mapState, null)(translate()(withRouter(SectionHeader)));
