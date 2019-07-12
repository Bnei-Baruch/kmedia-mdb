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
import Logo from '../../images/icons/Logo';

let isMobileDevice = false;

const RenderHeaderSearch = React.forwardRef(({ t, location }, headerSearchElement) => (
  <div ref={headerSearchElement}>
    <Segment color="blue" inverted className="header_search">
      <WrappedOmniBox t={t} location={location} />
    </Segment>
  </div>
));

const shouldShowSearch = (location) => {
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

const menuButtonElement1 = createRef();

const menuButtonElement2 = createRef();

const showSearchButtonElement = createRef();

const headerSearchElement = createRef();

class Layout extends Component {
  static propTypes = {
    location: shapes.HistoryLocation.isRequired,
    route: shapes.Route.isRequired,
    language: PropTypes.string.isRequired,
    contentLanguage: PropTypes.string.isRequired,
    setContentLanguage: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const { deviceInfo, location } = props;
    isMobileDevice                 = deviceInfo.device && deviceInfo.device.type === 'mobile';
    this.state                     = {
      sidebarActive: false,
      isShowHeaderSearch: false,
      embed: playerHelper.getEmbedFromQuery(location),
      pathname: props.location ? props.location.pathname : null,
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.clickOutside, true);
  }

  static getDerivedStateFromProps(nextProps, state) {
    if (nextProps.location && nextProps.location.pathname === state.pathname) {
      return null;
    }

    const isShowHeaderSearch = (
      nextProps.location
      && isMobileDevice
      && nextProps.location.pathname.endsWith('search')
    );
    return { isShowHeaderSearch, pathname: nextProps.pathname };
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
    if (!this.state || !this.state.isShowHeaderSearch || e.target === headerSearchElement) {
      return false;
    }

    if (headerSearchElement.current && headerSearchElement.current.contains(e.target)) {
      return false;
    }

    const hasTarget = showSearchButtonElement.current && showSearchButtonElement.current.contains(e.target);
    return !hasTarget;
  };

  isCloseSideBar = (e) => {
    if (!this.state || !this.state.sidebarActive || e.target === this.sidebarElement) {
      return false;
    }

    if (this.sidebarElement && this.sidebarElement.contains(e.target)) {
      return false;
    }

    if (menuButtonElement1.current && menuButtonElement1.current.contains(e.target)) {
      return false;
    }

    const hasTarget = menuButtonElement2.current && menuButtonElement2.current.contains(e.target);
    return !hasTarget;
  };

  toggleSidebar = () => {
    const { sidebarActive } = this.state;
    this.setState({ sidebarActive: !sidebarActive });
  };

  // Required for handling outside sidebar on click outside sidebar,
  closeSidebar = () => this.setState({ sidebarActive: false });

  showHeaderSearch = () => {
    const { isShowHeaderSearch } = this.state;
    this.setState({ isShowHeaderSearch: !isShowHeaderSearch });
  };

  render() {
    const { t, location, route, language, contentLanguage, setContentLanguage } = this.props;
    const { sidebarActive, embed }                                              = this.state;

    const showSearch = shouldShowSearch(location);

    let sideBarIcon = <Icon name="sidebar" />;
    if (sidebarActive) {
      sideBarIcon = <Icon size="large" name="x" />;
    }

    if (embed) {
      return (
        <div>
          {renderRoutes(route.routes)}
        </div>
      );
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
              <Logo width="40" height="40" />
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
                  isMobileDevice={isMobileDevice}
                />
              </Menu.Item>
              {
                showSearch && isMobileDevice
                  ? (
                    <Ref innerRef={showSearchButtonElement}>
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
        {this.state.isShowHeaderSearch && <RenderHeaderSearch t={this.props.t} location={this.props.location} ref={headerSearchElement} />}
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
              <Logo />
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
