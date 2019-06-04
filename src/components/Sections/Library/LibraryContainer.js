import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { push as routerPush, replace as routerReplace } from 'connected-react-router';
import { withNamespaces } from 'react-i18next';
import { Button, Container, Grid, Header, Input, Ref } from 'semantic-ui-react';

import { formatError, isEmpty } from '../../../helpers/utils';
import { actions as assetsActions, selectors as assets } from '../../../redux/modules/assets';
import { actions as sourceActions, selectors as sources } from '../../../redux/modules/sources';
import { selectors as settings } from '../../../redux/modules/settings';
import { selectors as device } from '../../../redux/modules/device';
import * as shapes from '../../shapes';
import { ErrorSplash, FrownSplash } from '../../shared/Splash/Splash';
import Helmets from '../../shared/Helmets';
import LibraryContentContainer from './LibraryContentContainer';
import TOC from './TOC';
import LibrarySettings from './LibrarySettings';
import Share from './Share';

class LibraryContainer extends Component {
  static propTypes = {
    sourceId: PropTypes.string.isRequired,
    indexMap: PropTypes.objectOf(shapes.DataWipErr),
    language: PropTypes.string.isRequired,
    contentLanguage: PropTypes.string.isRequired,
    fetchIndex: PropTypes.func.isRequired,
    sourcesSortBy: PropTypes.func.isRequired,
    getSourceById: PropTypes.func.isRequired,
    getPathByID: PropTypes.func,
    sortBy: PropTypes.string.isRequired,
    NotToSort: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    NotToFilter: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    areSourcesLoaded: PropTypes.bool,
    t: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    history: shapes.History.isRequired,
    deviceInfo: shapes.UserAgentParserResults.isRequired,
  };

  static defaultProps = {
    indexMap: {
      data: null,
      wip: false,
      err: null,
    },
    areSourcesLoaded: false,
    getPathByID: undefined,
  };

  state = {
    lastLoadedId: null,
    isReadable: false,
    tocIsActive: false,
    fontSize: 0,
    theme: 'light',
    match: '',
  };

  componentDidMount() {
    this.updateSticky();
    window.addEventListener('resize', this.updateSticky);
    window.addEventListener('load', this.updateSticky);

    const { sourceId, areSourcesLoaded, replace, history }                             = this.props;
    const { location: { state: { tocIsActive } = { state: { tocIsActive: false } } } } = history;

    if (tocIsActive) {
      this.setState({ tocIsActive });
    }

    if (!areSourcesLoaded) {
      return;
    }

    const firstLeafId = this.firstLeafId(sourceId);
    if (firstLeafId !== sourceId || this.state.lastLoadedId !== sourceId) {
      if (firstLeafId !== sourceId) {
        replace(`sources/${firstLeafId}`);
      } else {
        this.setState({ lastLoadedId: sourceId, language: this.props.language });
        this.fetchIndices(sourceId);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { sourceId, areSourcesLoaded, language, replace } = nextProps;
    if (!areSourcesLoaded) {
      return;
    }
    if (this.state.language && language !== this.state.language) {
      this.loadNewIndices(sourceId, this.props.language);
      return;
    }

    const firstLeafId = this.firstLeafId(sourceId);
    if (firstLeafId !== sourceId
      || this.props.sourceId !== sourceId
      || this.state.lastLoadedId !== sourceId) {
      if (firstLeafId === sourceId) {
        this.loadNewIndices(sourceId, this.props.language);
      } else {
        replace(`sources/${firstLeafId}`);
      }
    }
  }

  componentDidUpdate() {
    this.updateSticky();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateSticky);
    window.removeEventListener('load', this.updateSticky);
  }

  getFullPath = (sourceId) => {
    // Go to the root of this sourceId
    const { getPathByID } = this.props;

    if (!getPathByID) {
      return [{ id: '0' }, { id: sourceId }];
    }

    const path = getPathByID(sourceId);

    if (!path || path.length < 2 || !path[1]) {
      return [{ id: '0' }, { id: sourceId }];
    }

    return path;
  };

  isMobileDevice = () => {
    const { deviceInfo } = this.props;
    return deviceInfo.device && deviceInfo.device.type === 'mobile';
  };

  updateSticky = () => {
    // take the secondary header height for sticky stuff calculations
    if (this.secondaryHeaderRef) {
      const { height } = this.secondaryHeaderRef.getBoundingClientRect();
      if (this.state.secondaryHeaderHeight !== height) {
        this.setState({ secondaryHeaderHeight: height });
      }
    }

    // check fixed header width in pixels for text-overflow:ellipsis
    if (this.contentHeaderRef) {
      const { width } = this.contentHeaderRef.getBoundingClientRect();
      if (this.state.contentHeaderWidth !== width) {
        this.setState({ contentHeaderWidth: width });
      }
    }
  };

  firstLeafId = (sourceId) => {
    const { getSourceById } = this.props;

    const { children } = getSourceById(sourceId) || { children: [] };
    if (isEmpty(children)) {
      return sourceId;
    }

    return this.firstLeafId(children[0]);
  };

  handleContextRef = (ref) => {
    this.contextRef = ref;
  };

  handleSecondaryHeaderRef = (ref) => {
    this.secondaryHeaderRef = ref;
  };

  handleContentHeaderRef = (ref) => {
    this.contentHeaderRef = ref;
  };

  handleTocIsActive = () => {
    const { tocIsActive } = this.state;
    this.setState({ tocIsActive: !tocIsActive });
  };

  handleIsReadable = () => {
    const { isReadable } = this.state;
    this.setState({ isReadable: !isReadable });
  };

  handleSettings = (setting) => {
    this.setState(setting);
  };

  fetchIndices = (sourceId) => {
    const { indexMap, fetchIndex } = this.props;
    if (isEmpty(sourceId) || !isEmpty(indexMap[sourceId])) {
      return;
    }

    fetchIndex(sourceId);
  };

  header = (sourceId, properParentId) => {
    const { getSourceById } = this.props;

    const source             = getSourceById(sourceId);
    const properParentSource = getSourceById(properParentId);

    if (!source || !properParentSource) {
      return <div />;
    }

    const { name: parentName, description, parent_id: parentId } = properParentSource;
    const parentSource                                           = getSourceById(parentId);

    if (!parentSource) {
      return <div />;
    }

    const { name: sourceName }                      = source;
    const { name: kabName, full_name: kabFullName } = parentSource;

    let displayName = kabFullName || kabName;
    if (kabFullName && kabName) {
      displayName += ` (${kabName})`;
    }

    const { contentHeaderWidth, } = this.state;
    return (
      <Header size="small">
        <Helmets.Basic title={`${sourceName} - ${parentName} - ${kabName}`} description={description} />
        <Ref innerRef={this.handleContentHeaderRef}>
          <div />
        </Ref>
        <Header.Subheader>
          <small style={{ width: `${contentHeaderWidth}px` }}>
            {displayName}
            /
            {`${parentName} ${description || ''} `}
          </small>
        </Header.Subheader>
        <span style={{ width: `${contentHeaderWidth}px` }}>{sourceName}</span>
      </Header>

    );
  };

  properParentId = path => (path[1].id);

  loadNewIndices = (sourceId, language) => {
    this.setState({ lastLoadedId: sourceId, language });
    this.fetchIndices(sourceId);
  };

  sortButton = () => {
    const { sortBy, sourcesSortBy } = this.props;
    let sortOrder;
    if (sortBy === 'AZ') {
      sortOrder = 'Book';
    } else {
      sortOrder = 'AZ';
    }
    sourcesSortBy(sortOrder);
  };

  switchSortingOrder = (parentId) => {
    const { sortBy, NotToSort } = this.props;

    if (NotToSort.findIndex(a => a === parentId) !== -1) {
      return null;
    }

    return (
      <Button
        compact
        size="small"
        icon="sort alphabet ascending"
        color={sortBy === 'AZ' ? 'blue' : ''}
        active={sortBy === 'AZ'}
        basic={sortBy !== 'AZ'}
        onClick={this.sortButton}
      />
    );
  };

  handleFilterChange = (e, data) => {
    this.setState({ match: data.value });
  };

  handleFilterKeyDown = (e) => {
    if (e.keyCode === 27) { // Esc
      this.setState({ match: '' });
    }
  };

  print = () => {
    window.print();
  };

  matchString = (parentId, t) => {
    const { NotToFilter } = this.props;
    const { match }       = this.state;
    if (NotToFilter.findIndex(a => a === parentId) !== -1) {
      return null;
    }
    return (
      <Input
        fluid
        size="mini"
        icon="search"
        placeholder={t('sources-library.filter')}
        value={match}
        onChange={this.handleFilterChange}
        onKeyDown={this.handleFilterKeyDown}
      />
    );
  };

  render() {
    const { sourceId, indexMap, getSourceById, language, contentLanguage, t, push, history, deviceInfo } = this.props;

    const fullPath = this.getFullPath(sourceId);
    const parentId = this.properParentId(fullPath);

    const index = isEmpty(sourceId) ? {} : indexMap[sourceId];

    let content;
    const { err } = index || {};
    if (err) {
      if (err.response && err.response.status === 404) {
        content = <FrownSplash text={t('messages.source-content-not-found')} />;
      } else {
        content = <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
      }
    } else {
      const downloadAllowed = deviceInfo.os.name !== 'iOS';
      content = (
        <LibraryContentContainer
          source={sourceId}
          index={index}
          uiLanguage={language}
          contentLanguage={contentLanguage}
          langSelectorMount={this.headerMenuRef}
          history={history}
          downloadAllowed={downloadAllowed}
        />
      );
    }

    const
      {
        isReadable,
        fontSize,
        theme,
        fontType,
        tocIsActive,
        match,
      }                           = this.state;
    let { secondaryHeaderHeight } = this.state;
    if (isNaN(secondaryHeaderHeight)) {
      secondaryHeaderHeight = 0;
    }
    const matchString = this.matchString(parentId, t);

    return (
      <div
        className={classNames({
          source: true,
          'is-readable': isReadable,
          'toc--is-active': tocIsActive,
          [`is-${theme}`]: true,
          [`is-${fontType}`]: true,
        })}
      >
        <div className="layout__secondary-header" ref={this.handleSecondaryHeaderRef}>
          <Container>
            <Grid padded centered>
              <Grid.Row verticalAlign="bottom">
                <Grid.Column mobile={16} tablet={16} computer={4} className="source__toc-header">
                  <div className="source__header-title mobile-hidden">
                    <Header size="small">{t('sources-library.toc')}</Header>
                  </div>
                  <div className="source__header-toolbar">
                    {matchString}
                    {this.switchSortingOrder(parentId)}
                    <Button
                      compact
                      size="small"
                      className="computer-hidden large-screen-hidden widescreen-hidden"
                      icon="list layout"
                      onClick={this.handleTocIsActive}
                    />
                  </div>
                </Grid.Column>
                <Grid.Column mobile={16} tablet={16} computer={12} className="source__content-header">
                  <div className="source__header-title">{this.header(sourceId, parentId)}</div>
                  <div className="source__header-toolbar">
                    <Button compact size="small" className="mobile-hidden" icon="print" onClick={this.print} />
                    <div id="download-button" />
                    <LibrarySettings fontSize={fontSize} handleSettings={this.handleSettings} />
                    <Button compact size="small" icon={isReadable ? 'compress' : 'expand'} onClick={this.handleIsReadable} />
                    <Button compact size="small" className="computer-hidden large-screen-hidden widescreen-hidden" icon="list layout" onClick={this.handleTocIsActive} />
                    <Share isMobile={this.isMobileDevice()} />
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </div>
        <Container style={{ paddingTop: `${secondaryHeaderHeight}px` }}>
          <Grid padded centered>
            <Grid.Row className="is-fitted">
              <Grid.Column mobile={16} tablet={16} computer={4} onClick={this.handleTocIsActive}>
                <TOC
                  language={language}
                  match={matchString ? match : ''}
                  fullPath={fullPath}
                  rootId={parentId}
                  contextRef={this.contextRef}
                  getSourceById={getSourceById}
                  apply={push}
                  stickyOffset={secondaryHeaderHeight + (isReadable ? 0 : 60)}
                />
              </Grid.Column>
              <Grid.Column
                mobile={16}
                tablet={16}
                computer={12}
                className={classNames({
                  'source__content-wrapper': true,
                  [`size${fontSize}`]: true,
                })}
              >
                <Ref innerRef={this.handleContextRef}>
                  <div
                    className="source__content"
                    style={{ minHeight: `calc(100vh - ${secondaryHeaderHeight + (isReadable ? 0 : 60) + 14}px)` }}
                  >
                    {content}
                  </div>
                </Ref>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default withRouter(connect(
  (state, ownProps) => ({
    sourceId: ownProps.match.params.id,
    indexMap: assets.getSourceIndexById(state.assets),
    language: settings.getLanguage(state.settings),
    contentLanguage: settings.getContentLanguage(state.settings),
    getSourceById: sources.getSourceById(state.sources),
    getPathByID: sources.getPathByID(state.sources),
    sortBy: sources.sortBy(state.sources),
    areSourcesLoaded: sources.areSourcesLoaded(state.sources),
    NotToSort: sources.NotToSort,
    NotToFilter: sources.NotToFilter,
    deviceInfo: device.getDeviceInfo(state.device),
  }),
  dispatch => bindActionCreators({
    fetchIndex: assetsActions.sourceIndex,
    sourcesSortBy: sourceActions.sourcesSortBy,
    push: routerPush,
    replace: routerReplace,
  }, dispatch)
)(withNamespaces()(withRouter(LibraryContainer))));
