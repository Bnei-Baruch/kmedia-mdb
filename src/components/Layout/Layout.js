import React, { Component, createRef, useContext } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { renderRoutes } from 'react-router-config';
import { Header, Icon, Menu, Ref, Segment } from 'semantic-ui-react';
import Headroom from 'react-headroom';

import { ALL_LANGUAGES, VERSION_WITH_PERSONALIZATION } from '../../helpers/consts';
import playerHelper from '../../helpers/player';
import { selectors as settings } from '../../redux/modules/settings';
import * as shapes from '../shapes';
import Link from '../Language/MultiLanguageLink';
import WrappedOmniBox from '../Search/OmniBox';
import GAPageView from './GAPageView/GAPageView';
import MenuItems from './MenuItems';
import HandleLanguages from './HandleLanguages';
import Footer from './Footer';
import TopMost from './TopMost';
import DonateNow, { VirtualHomeButton } from './DonateNow';
import Logo from '../../images/icons/Logo';
import { ClientChroniclesContext, DeviceInfoContext } from '../../helpers/app-contexts';
import Login from './Login';

const WrappedOmniBoxWithChronicles = ({ location }) => {
  const chronicles = useContext(ClientChroniclesContext);
  return <WrappedOmniBox location={location} chronicles={chronicles} />;
};

const RenderHeaderSearch = React.forwardRef(({ t, location }, headerSearchElement) => (
  <div ref={headerSearchElement}>
    <Segment color="blue" inverted className="header_search">
      <WrappedOmniBoxWithChronicles location={location} />
    </Segment>
  </div>
));

const shouldShowSearch = location => {
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

const menuButtonElement1      = createRef();
const menuButtonElement2      = createRef();
const showSearchButtonElement = createRef();
const headerSearchElement     = createRef();

class Layout extends Component {
  static contextType = DeviceInfoContext;

  static propTypes = {
    location: shapes.HistoryLocation.isRequired,
    route: shapes.Route.isRequired,
    language: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const { location } = props;

    this.state = {
      sidebarActive: false,
      isShowHeaderSearch: false,
      embed: playerHelper.getEmbedFromQuery(location),
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.clickOutside, true);
    const { location }       = this.props;
    const { isMobileDevice } = this.context;

    const isShowHeaderSearch =
            isMobileDevice
            && location.pathname.endsWith('search');

    // false is set in the constructor so no need to update
    if (isShowHeaderSearch) {
      this.setState({ isShowHeaderSearch });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { location, language }                = this.props;
    const { sidebarActive, isShowHeaderSearch } = this.state;

    return (language !== nextProps.language
      || location.pathname !== nextProps.location.pathname
      || sidebarActive !== nextState.sidebarActive
      || isShowHeaderSearch !== nextState.isShowHeaderSearch);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.clickOutside, true);
  }

  // i.e, main, header of footer.
  clickOutside = e => {
    if (this.isCloseSideBar(e)) {
      this.closeSidebar();
    }

    if (this.isCloseHeaderSearch(e)) {
      this.showHeaderSearch();
    }
  };

  isCloseHeaderSearch = e => {
    if (!this.state || !this.state.isShowHeaderSearch || e.target === headerSearchElement) {
      return false;
    }

    if (headerSearchElement.current && headerSearchElement.current.contains(e.target)) {
      return false;
    }

    const hasTarget = showSearchButtonElement.current && showSearchButtonElement.current.contains(e.target);
    return !hasTarget;
  };

  isCloseSideBar = e => {
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
    const { t, location, route, language }             = this.props;
    const { sidebarActive, embed, isShowHeaderSearch } = this.state;
    const { isMobileDevice }                           = this.context;

    const showSearch = shouldShowSearch(location);

    const sideBarIcon = sidebarActive
      ? <Icon size="large" name="x" />
      : <Icon name="sidebar" />;

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
        <div className="headroom-z-index-802">
          <Headroom>
            <div className="layout__header">
              <Menu inverted borderless size="huge" color="blue">
                <div ref={menuButtonElement1}>
                  <Menu.Item
                    icon
                    as="a"
                    className="layout__sidebar-toggle"
                    onClick={this.toggleSidebar}
                  >
                    {sideBarIcon}
                  </Menu.Item>
                </div>
                <Menu.Item className="logo" header as={Link} to="/">
                  <Logo width="40" height="40" />
                  <Header inverted as="h1" content={t('nav.top.header')} />
                </Menu.Item>
                <Menu.Item className={isMobileDevice ? 'layout__search mobile-hidden' : 'layout__search layout__search_max_width'}>
                  {
                    showSearch && <WrappedOmniBoxWithChronicles location={location} />
                  }
                </Menu.Item>
                <Menu.Menu position="right" className="no-padding no-margin">
                  <Menu.Item className="no-margin">
                    <HandleLanguages language={language} />
                  </Menu.Item>
                  {
                    showSearch && isMobileDevice &&
                    <Ref innerRef={showSearchButtonElement}>
                      <Menu.Item as="a" position="right">
                        <Icon name="search" className="no-margin" onClick={this.showHeaderSearch} />
                      </Menu.Item>
                    </Ref>
                  }
                  <Menu.Item position="right" className="mobile-hidden">
                    <DonateNow language={language} />
                    <VirtualHomeButton />
                  </Menu.Item>
                  <Menu.Item position="right">
                    {VERSION_WITH_PERSONALIZATION && <Login language={language} />}
                  </Menu.Item>
                  <TopMost />
                </Menu.Menu>
              </Menu>
            </div>
            {isShowHeaderSearch && <RenderHeaderSearch t={t} location={location} ref={headerSearchElement} />}
          </Headroom>
        </div>
        <div
          className={clsx('layout__sidebar', { 'is-active': sidebarActive })}
          ref={el => {
            this.sidebarElement = el;
          }}
        >
          <Menu inverted size="huge" color="blue">
            <div ref={menuButtonElement2}>
              <Menu.Item
                icon
                as="a"
                className="layout__sidebar-toggle"
                onClick={this.closeSidebar}
              >
                {sideBarIcon}
              </Menu.Item>
            </div>
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

export default connect(state => ({
  language: settings.getLanguage(state.settings),
}))(withNamespaces()(Layout));
