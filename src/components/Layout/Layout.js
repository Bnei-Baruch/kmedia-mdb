import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { Flag, Grid, Header, Icon, Menu } from 'semantic-ui-react';

import { LANGUAGES } from '../../helpers/consts';
import { actions, selectors } from '../../redux/modules/settings';
import Routes from './Routes';
import MenuItems from './MenuItems';

class Layout extends Component {

  static propTypes = {
    language: PropTypes.string.isRequired,
    setLanguage: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  state = {
    sidebarActive: false
  };

  handleChangeLanguage = (e) => {
    const flag     = e.target.getAttribute('class').split(' ')[0];
    const language = Array.from(Object.values(LANGUAGES)).find(x => x.flag === flag).value;
    if (this.props.language !== language) {
      this.props.setLanguage(language);
    }
  };

  toggleSidebar = (e, data) =>
    this.setState({ sidebarActive: !this.state.sidebarActive });

  render() {
    const { t }             = this.props;
    const { sidebarActive } = this.state;

    return (
      <div className="layout">
        <div className="layout__header">
          <Menu inverted borderless size="huge" color="blue">
            <Menu.Item icon as="a" className="layout__sidebar-toggle" onClick={this.toggleSidebar}>
              <Icon name="sidebar" />
            </Menu.Item>
            <Menu.Item header as={Link} to="/">
              <Header inverted as="h2">
                {t('nav.top.header')}
              </Header>
            </Menu.Item>
            <Menu.Menu position="right">
              <Menu.Item>
                <Flag name="us" onClick={this.handleChangeLanguage} />
                <Flag name="ru" onClick={this.handleChangeLanguage} />
                <Flag name="il" onClick={this.handleChangeLanguage} />
              </Menu.Item>
            </Menu.Menu>
          </Menu>
        </div>
        <div className={classnames({ 'layout__sidebar': true, 'is-active': sidebarActive })}>
          <Menu inverted borderless size="huge" color="blue">
            <Menu.Item icon as="a" className="layout__sidebar-toggle" onClick={this.toggleSidebar}>
              <Icon name="sidebar" />
            </Menu.Item>
            <Menu.Item header as={Link} to="/">
              <Header inverted as="h2">
                {t('nav.top.header')}
              </Header>
            </Menu.Item>
          </Menu>
          <div className="layout__sidebar-menu">
            <MenuItems simple t={t} />
          </div>
        </div>
        <div className="layout__content">
          <Grid padded>
            <Grid.Row>
              <Routes />
            </Grid.Row>
          </Grid>
          <div className="layout__footer" />
        </div>
      </div>
    );
  }
}

function mapState(state) {
  return {
    language: selectors.getLanguage(state.settings),
  };
}

function mapDispatch(dispatch) {
  return bindActionCreators({ setLanguage: actions.setLanguage }, dispatch);
}

export default connect(mapState, mapDispatch)(translate()(Layout));
