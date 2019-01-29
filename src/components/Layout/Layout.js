import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { renderRoutes } from 'react-router-config';
import { Button, Header, Icon, Menu, Ref, Segment } from 'semantic-ui-react';

import { ALL_LANGUAGES } from '../../helpers/consts';
import { actions, selectors as settings } from '../../redux/modules/settings';
import { selectors as device } from '../../redux/modules/device';
import * as shapes from '../shapes';
import Link from '../Language/MultiLanguageLink';
import WrappedOmniBox from '../Search/OmniBox';
import GAPageView from './GAPageView/GAPageView';
import MenuItems from './MenuItems';
import HandleLanguages from './HandleLanguages';
import Footer from './Footer';
import TopMost from './TopMost';
import DonateNow from './DonateNow';
import logo from '../../images/logo.svg';

class Layout extends Component {
  static propTypes = {
    location: shapes.HistoryLocation.isRequired,
    route: shapes.Route.isRequired,
    language: PropTypes.string.isRequired,
    contentLanguage: PropTypes.string.isRequired,
    setContentLanguage: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  state = {
    sidebarActive: false,
    showHeaderSearch: false
  };

  menuButtonElement1 = createRef();

  menuButtonElement2 = createRef();

  showSearchButtonElement = createRef();

  componentDidMount() {
    document.addEventListener('click', this.clickOutside, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.clickOutside, true);
  }

  // i.e, main, header of footer.
  clickOutside = (e) => {
    const { sidebarActive, isShowHeaderSearch } = this.state;
    if (sidebarActive
      && e.target !== this.sidebarElement
      && !this.sidebarElement.contains(e.target)
      && !this.menuButtonElement1.current.contains(e.target)
      && !this.menuButtonElement2.current.contains(e.target)) {
      this.closeSidebar();
    }

    if (isShowHeaderSearch
      && e.target !== this.headerSearchElement
      && !this.headerSearchElement.contains(e.target)
      && !this.showSearchButtonElement.current.contains(e.target)) {
      this.showHeaderSearch();
    }
  };

  toggleSidebar = () => this.setState({ sidebarActive: !this.state.sidebarActive });

  // Required for handling outside sidebar on click outside sidebar,
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

  isMobileDevice = () => {
    const { deviceInfo } = this.props;
    return deviceInfo.device && deviceInfo.device.type === 'mobile';
  };

  showHeaderSearch = () => this.setState({ isShowHeaderSearch: !this.state.isShowHeaderSearch });

  renderHeaderSearch = () => {
    const { isShowHeaderSearch } = this.state;
    if (!isShowHeaderSearch) {
      return null;
    }

    const { t, location } = this.props;
    return (
      <div
        className="header_search"
        ref={(el) => {
          this.headerSearchElement = el;
        }}
      >
        <Segment color="blue" inverted>
          <WrappedOmniBox t={t} location={location} />
        </Segment>
      </div>);
  };

  render() {
    const { t, location, route, language, contentLanguage, setContentLanguage } = this.props;
    const { sidebarActive }                                                     = this.state;

    const showSearch = this.shouldShowSearch(location);

    let sideBarIcon = <Icon name="sidebar" />;
    if (sidebarActive) {
      sideBarIcon = <Icon size="large" name="x" />;  
    }

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
            <Ref innerRef={this.menuButtonElement1}>
              <Menu.Item
                icon
                as="a"
                className="layout__sidebar-toggle"
                onClick={this.toggleSidebar}
              >
                {sideBarIcon}
              </Menu.Item>
            </Ref>
            <Menu.Item className="logo" header as={Link} to="/">
              <img src={logo} alt="logo" />
              <Header inverted as="h1" content={t('nav.top.header')} />
            </Menu.Item>
            <Menu.Item className="layout__search mobile-hidden">
              {
                showSearch
                  ? <WrappedOmniBox location={location} />
                  : null
              }
            </Menu.Item>
            <Menu.Menu position="right" className="padding0">
              <Ref innerRef={this.showSearchButtonElement}>
                <Menu.Item>
                  <HandleLanguages
                    language={language}
                    contentLanguage={contentLanguage}
                    setContentLanguage={setContentLanguage}
                    location={location}
                    isMobileDevice={this.isMobileDevice()}
                  />
                  {
                    showSearch && this.isMobileDevice()
                      ? <Button icon="search" color="blue" onClick={this.showHeaderSearch} />
                      : null
                  }
                </Menu.Item>
              </Ref>
              <Menu.Item className="mobile-hidden">
                <DonateNow language={language} />
              </Menu.Item>
              <TopMost />
            </Menu.Menu>
          </Menu>
        </div>
        {this.renderHeaderSearch()}
        <div
          className={classnames('layout__sidebar', { 'is-active': sidebarActive })}
          ref={(el) => {
            this.sidebarElement = el;
          }}
        >
          <Menu inverted size="huge" color="blue">
            <Ref innerRef={this.menuButtonElement2}>
              <Menu.Item
                icon
                as="a"
                className="layout__sidebar-toggle"
                onClick={this.closeSidebar}
              >
                {sideBarIcon}
              </Menu.Item>
            </Ref>
            <Menu.Item className="logo mobile-hidden" header as={Link} to="/" onClick={this.closeSidebar}>
              <img src={logo} alt="logo" />
              <Header inverted as="h1" content={t('nav.top.header')} />
            </Menu.Item>
          </Menu>
          <div className="layout__sidebar-menu">
            <MenuItems simple language={language} onItemClick={this.closeSidebar} />
          </div>
        </div>
        <div className="layout__main">
          <div className="layout__content">
            {renderRoutes(route.routes)}
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    language: settings.getLanguage(state.settings),
    contentLanguage: settings.getContentLanguage(state.settings),
    deviceInfo: device.getDeviceInfo(state.device),
  }),
  {
    setContentLanguage: actions.setContentLanguage,
  }
)(withNamespaces()(Layout));
