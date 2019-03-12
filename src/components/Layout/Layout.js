import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { renderRoutes } from 'react-router-config';
import { Header, Icon, Menu, Ref, Segment } from 'semantic-ui-react';

import { ALL_LANGUAGES } from '../../helpers/consts';
import playerHelper from '../../helpers/player';
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

  headerSearchElement = createRef();

  componentWillMount() {
    const { location } = this.props;
    this.setState({ embed: playerHelper.getEmbedFromQuery(location) });
  }

  componentDidMount() {
    document.addEventListener('click', this.clickOutside, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.clickOutside, true);
  }

  // i.e, main, header of footer.
  clickOutside = (e) => {
    if (this.isCloseSideBar(e)) {
      this.closeSidebar();
    }

    if (this.isCloseHeaderSearch(e)) {
      this.showHeaderSearch();
    }
  };

  isCloseHeaderSearch = (e) => {
    if (!this.state || !this.state.isShowHeaderSearch || e.target === this.headerSearchElement) {
      return false;
    }

    if (this.headerSearchElement.current && this.headerSearchElement.current.contains(e.target)) {
      return false;
    }

    if (this.showSearchButtonElement.current && this.showSearchButtonElement.current.contains(e.target)) {
      return false;
    }

    return true;
  };

  isCloseSideBar = (e) => {
    if (!this.state || !this.state.sidebarActive || e.target === this.sidebarElement) {
      return false;
    }

    if (this.sidebarElement && this.sidebarElement.contains(e.target)) {
      return false;
    }

    if (this.menuButtonElement1.current && this.menuButtonElement1.current.contains(e.target)) {
      return false;
    }

    if (this.menuButtonElement2.current && this.menuButtonElement2.current.contains(e.target)) {
      return false;
    }

    return true;
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
      <Ref innerRef={this.headerSearchElement}>
        <Segment color="blue" inverted className="header_search">
          <WrappedOmniBox t={t} location={location} />
        </Segment>
      </Ref>
    );
  };

  render() {
    const { t, location, route, language, contentLanguage, setContentLanguage } = this.props;
    const { sidebarActive, embed }                                              = this.state;

    const showSearch = this.shouldShowSearch(location);

    let sideBarIcon = <Icon name="sidebar" />;
    if (sidebarActive) {
      sideBarIcon = <Icon size="large" name="x" />;
    }

    return !embed ? (
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
            <Menu.Menu position="right" className="no-padding no-margin">
              <Menu.Item className="no-margin">
                <HandleLanguages
                  language={language}
                  contentLanguage={contentLanguage}
                  setContentLanguage={setContentLanguage}
                  location={location}
                  isMobileDevice={this.isMobileDevice()}
                />
              </Menu.Item>
              {
                showSearch && this.isMobileDevice()
                  ? (
                    <Ref innerRef={this.showSearchButtonElement}>
                      <Menu.Item as="a" position="right">
                        <Icon name="search" className="no-margin" onClick={this.showHeaderSearch} />
                      </Menu.Item>
                    </Ref>
                  )
                  : null
              }
              <Menu.Item position="right" className="mobile-hidden">
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
    ) : (
      <div>
        {renderRoutes(route.routes)}
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
