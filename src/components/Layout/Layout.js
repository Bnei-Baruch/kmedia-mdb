import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import classnames from 'classnames';
import { renderRoutes } from 'react-router-config';
import { connect } from 'react-redux';
import { Dropdown, Header, Icon, Menu, Flag } from 'semantic-ui-react';

import {
  ALL_LANGUAGES,
  LANG_ENGLISH,
  LANG_HEBREW,
  LANG_RUSSIAN,
  LANG_SPANISH,
  LANG_UKRAINIAN,
  LANGUAGES
} from '../../helpers/consts';
import * as shapes from '../shapes';
import Link from '../Language/MultiLanguageLink';
import Helmets from '../shared/Helmets';
import WrappedOmniBox from '../Search/OmniBox';
import GAPageView from './GAPageView/GAPageView';
import MenuItems from './MenuItems';
import Footer from './Footer';
import logo from '../../images/logo.svg';
import { selectors as settings } from '../../redux/modules/settings';

const dropdownLangs = [LANG_HEBREW, LANG_ENGLISH, LANG_RUSSIAN, LANG_SPANISH, LANG_UKRAINIAN];

class Layout extends Component {
  static propTypes = {
    location: shapes.HistoryLocation.isRequired,
    language: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
  };

  state = {
    sidebarActive: false
  };

  // Required for handling outside sidebar on click outside sidebar,
  // i.e, main, header of footer.
  componentDidMount() {
    document.addEventListener('click', this.clickOutside, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.clickOutside, true);
  }

  clickOutside = (e) => {
    if (this.state &&
      this.state.sidebarActive &&
      e.target !== this.sidebarElement &&
      !this.sidebarElement.contains(e.target)) {
      this.closeSidebar();
    }
  };

  toggleSidebar = () => this.setState({ sidebarActive: !this.state.sidebarActive });

  closeSidebar = () => this.setState({ sidebarActive: false });

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
    const { t, location, route, language } = this.props;
    const { sidebarActive }                = this.state;

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
        <Helmets.Basic title={t('nav.top.header')} />
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
            <Menu.Menu position="right">
              <Dropdown item text={t(`constants.languages.${language}`)}>
                <Dropdown.Menu>
                  {
                    dropdownLangs.map(x => (
                      <Dropdown.Item key={x} as={Link} language={x}>
                        <Flag name={LANGUAGES[x].flag} />
                        {t(`constants.languages.${x}`)}
                      </Dropdown.Item>
                    ))
                  }
                </Dropdown.Menu>
              </Dropdown>
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

export default connect(
  state => ({
    language: settings.getLanguage(state.settings),
  })
)(translate()(Layout));
