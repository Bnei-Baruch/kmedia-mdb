import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import classnames from 'classnames';
import { renderRoutes } from 'react-router-config';
import { Header, Icon, Menu } from 'semantic-ui-react';

import { ALL_LANGUAGES } from '../../helpers/consts';
import * as shapes from '../shapes';
import Link from '../Language/MultiLanguageLink';
import WrappedOmniBox from '../Search/OmniBox';
import GAPageView from './GAPageView/GAPageView';
import MenuItems from './MenuItems';
import Footer from './Footer';
import UILanguage from './UILanguage';
import DonateNow from './DonateNow';
import logo from '../../images/logo.svg';

class Layout extends Component {
  static propTypes = {
    location: shapes.HistoryLocation.isRequired,
    route: shapes.Route.isRequired,
    t: PropTypes.func.isRequired,
  };

  state = {
    sidebarActive: false
  };

  componentDidMount() {
    document.addEventListener('click', this.clickOutside, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.clickOutside, true);
  }

  // Required for handling outside sidebar on click outside sidebar,
  // i.e, main, header of footer.
  clickOutside     = (e) => {
    if (this.state &&
      this.state.sidebarActive &&
      e.target !== this.sidebarElement &&
      !this.sidebarElement.contains(e.target)) {
      this.closeSidebar();
    }
  };

  toggleSidebar    = () => this.setState({ sidebarActive: !this.state.sidebarActive });

  closeSidebar     = () => this.setState({ sidebarActive: false });

  shouldShowSearch = (location) => {
    // we don't show the search on home page
    const parts = location.pathname.split('/').filter(x => (x !== ''));
    if (parts.length === 0) {
      return false;
    }
    if (parts.length === 1) {
      return !ALL_LANGUAGES.includes(parts[0]);
    }
    return true;
  };

  render() {
    const { t, location, route } = this.props;
    const { sidebarActive }      = this.state;

    const showSearch = this.shouldShowSearch(location);

    return (
      <div className="layout">
        {/* <div className="debug">
          <span className="widescreen-only">widescreen</span>
          <span className="large-screen-only">large screen</span>
          <span className="computer-only">computer</span>
          <span className="tablet-only">tablet</span>
          <span className="mobile-only">mobile</span>
        </div> */}
        <GAPageView location={location} />
        <div className="layout__header">
          <Menu inverted borderless size="huge" color="blue">
            <Menu.Item icon as="a" className="layout__sidebar-toggle" onClick={this.toggleSidebar}>
              <Icon name="sidebar" />
            </Menu.Item>
            <Menu.Item className="logo" header as={Link} to="/">
              <img src={logo} alt="logo" />
              <Header inverted as="h1" content={t('nav.top.header')} />
            </Menu.Item>
            <Menu.Item className="layout__search mobile-hidden">
              {
                showSearch ?
                  <WrappedOmniBox t={t} location={location} /> :
                  null
              }
            </Menu.Item>
            <Menu.Item className="mobile-hidden">
              <DonateNow t={t} />
            </Menu.Item>
            <Menu.Menu position="right">
              <UILanguage t={t} location={location} />
            </Menu.Menu>
          </Menu>
        </div>
        <div
          className={classnames('layout__sidebar', { 'is-active': sidebarActive })}
          ref={(el) => {
            this.sidebarElement = el;
          }}
        >
          <Menu inverted borderless size="huge" color="blue">
            <Menu.Item icon as="a" className="layout__sidebar-toggle" onClick={this.closeSidebar}>
              <Icon name="sidebar" />
            </Menu.Item>
            <Menu.Item className="logo mobile-hidden" header as={Link} to="/" onClick={this.closeSidebar}>
              <img src={logo} alt="logo" />
              <Header inverted as="h1" content={t('nav.top.header')} />
            </Menu.Item>
            <Menu.Item className="mobile-only layout__sidebar-search">
              <WrappedOmniBox t={t} location={location} onSearch={this.closeSidebar} />
            </Menu.Item>
          </Menu>
          <div className="layout__sidebar-menu">
            <MenuItems simple t={t} onItemClick={this.closeSidebar} />
          </div>
        </div>
        <div className="layout__main">
          <div className="layout__content">
            {renderRoutes(route.routes)}
          </div>
          <Footer t={t} />
        </div>
      </div>
    );
  }
}

export default translate()(Layout);
