
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import classnames from 'classnames';
import { Route } from 'react-router-dom';
import { Flag, Grid, Header, Icon, Menu } from 'semantic-ui-react';
import Routes from './Routes';
import MenuItems from './MenuItems';
import Footer from './Footer';
import Link from '../Language/MultiLanguageLink';
import { FLAG_TO_LANGUAGE } from '../../helpers/consts';
import logo from '../../images/logo.svg';

const flags = ['us', 'ru', 'il'];

class Layout extends Component {

  static propTypes = {
    t: PropTypes.func.isRequired,
  };

  state = {
    sidebarActive: false
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
            <Menu.Item className="logo" header as={Link} to="/">
              <img src={logo} alt="logo" />
              <Header inverted as="h2">
                {t('nav.top.header')}
              </Header>
            </Menu.Item>
            <Menu.Menu position="right">
              <Menu.Item>
                {
                  flags.map(flag => (
                    <Link language={FLAG_TO_LANGUAGE[flag]} key={flag}>
                      <Flag name={flag} />
                    </Link>
                  ))
                }
              </Menu.Item>
            </Menu.Menu>
          </Menu>
        </div>
        <div className={classnames({ 'layout__sidebar': true, 'is-active': sidebarActive })}>
          <Menu inverted borderless size="huge" color="blue">
            <Menu.Item icon as="a" className="layout__sidebar-toggle" onClick={this.toggleSidebar}>
              <Icon name="sidebar" />
            </Menu.Item>
            <Menu.Item className="logo" header as={Link} to="/">
              <img src={logo} alt="logo" />
              <Header inverted as="h2">
                {t('nav.top.header')}
              </Header>
            </Menu.Item>
          </Menu>
          <div className="layout__sidebar-menu">
            <MenuItems simple t={t} />
          </div>
        </div>
        <div className="layout__main">
          <div className="layout__content">
           {/* <Grid padded>
              <Grid.Row>*/}
                <Route component={Routes} />
              {/*</Grid.Row>
            </Grid>*/}
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}

export default translate()(Layout);
