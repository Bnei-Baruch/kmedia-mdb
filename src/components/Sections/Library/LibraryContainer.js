import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { push as routerPush, replace as routerReplace } from 'connected-react-router';
import { withNamespaces } from 'react-i18next';
import { Button, Container, Grid, Header, Input, Ref } from 'semantic-ui-react';
import Headroom from 'react-headroom';

import { formatError, isEmpty } from '../../../helpers/utils';
import { actions as assetsActions, selectors as assets } from '../../../redux/modules/assets';
import { actions as sourceActions, selectors as sources } from '../../../redux/modules/sources';
import { selectors as settings } from '../../../redux/modules/settings';
import { selectors as device } from '../../../redux/modules/device';
import * as shapes from '../../shapes';
import { ErrorSplash, FrownSplash } from '../../shared/Splash/Splash';
import Helmets from '../../shared/Helmets';
import LibraryContentContainer from './LibraryContentContainer';
import TOC, { getIndex } from './TOC';
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
    scrollTopPosition: 0
  };

  componentDidMount() {
    this.updateSticky();
    window.addEventListener('resize', this.updateSticky);
    window.addEventListener('load', this.updateSticky);

    const { sourceId, areSourcesLoaded, history }                                      = this.props;
    const { location: { state: { tocIsActive } = { state: { tocIsActive: false } } } } = history;

    if (tocIsActive || sourceId === 'grRABASH') {
      this.setState({ tocIsActive: true });
    }

    if (!areSourcesLoaded) {
      return;
    }

    this.replaceOrFetch(sourceId);
  }

  componentDidUpdate(prevProps, prevState) {
    const { sourceId, areSourcesLoaded } = this.props;
    if (!areSourcesLoaded) {
      return;
    }

    this.replaceOrFetch(sourceId);
    this.updateSticky();
    
    const { isReadable, scrollTopPosition, tocIsActive } = this.state;
    //on change full screen and normal view scroll to position
    if (prevState.isReadable !== isReadable && this.articleRef) {
      if (isReadable) {
        this.articleRef.scrollTop = scrollTopPosition;
      } else {
        document.scrollingElement.scrollTop = scrollTopPosition;
      }
    }

    // hide toc if only one item
    if (tocIsActive){
      const fullPath = this.getFullPath(sourceId);
      const activeIndex = getIndex(fullPath[1], fullPath[2]);

      if (activeIndex === -1){
        this.setState({ tocIsActive: false });
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateSticky);
    window.removeEventListener('load', this.updateSticky);
  }

  replaceOrFetch(nextSourceId) {
    const { sourceId, replace, language } = this.props;

    const firstLeafId = this.firstLeafId(nextSourceId);
    if (firstLeafId !== nextSourceId) {
      replace(`sources/${firstLeafId}`);
    } else if (sourceId !== nextSourceId
      || this.state.lastLoadedId !== nextSourceId
      || this.state.language !== language) {
      this.setState({ lastLoadedId: nextSourceId, language });
      this.fetchIndices(nextSourceId);
    }
  }

  fetchIndices = (sourceId) => {
    const { indexMap, fetchIndex } = this.props;
    if (isEmpty(sourceId) || !isEmpty(indexMap[sourceId])) {
      return;
    }

    fetchIndex(sourceId);
  };

  firstLeafId = (sourceId) => {
    const { getSourceById } = this.props;

    const { children } = getSourceById(sourceId) || { children: [] };
    if (isEmpty(children)) {
      return sourceId;
    }

    return this.firstLeafId(children[0]);
  };

  updateSticky = () => {
    // check fixed header width in pixels for text-overflow:ellipsis
    if (this.contentHeaderRef) {
      const { width } = this.contentHeaderRef.getBoundingClientRect();
      if (this.state.contentHeaderWidth !== width) {
        this.setState({ contentHeaderWidth: width });
      }
    }
  };

  handleContextRef = (ref) => this.contextRef = ref;

  handleContentArticleRef = (ref) => this.articleRef = ref;

  handleContentHeaderRef = (ref) => this.contentHeaderRef = ref;

  handleTocIsActive = () => {
    const { tocIsActive } = this.state;
    this.setState({ tocIsActive: !tocIsActive });
  };

  handleIsReadable = () => {
    const { isReadable }    = this.state;
    const scrollTopPosition = this.getScrollTop();
    this.setState({ isReadable: !isReadable, scrollTopPosition });
  };

  /**
   * Get position of scroll
   * @returns {number|*}
   */
  getScrollTop = () => this.state.isReadable 
    ? this.articleRef.scrollTop 
    : document.scrollingElement.scrollTop;

  handleSettings = (setting) => this.setState(setting);

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

  sortButton = () => {
    const { sortBy, sourcesSortBy } = this.props;
    const sortOrder = sortBy === 'AZ'
      ? 'Book'
      : 'AZ';

    sourcesSortBy(sortOrder);
  };

  switchSortingOrder = (parentId) => {
    const { sortBy, NotToSort } = this.props;

    if (NotToSort.findIndex(a => a === parentId) !== -1) {
      return null;
    }

    const sortByAZ = sortBy === 'AZ';

    return (
      <Button
        compact
        size="small"
        icon="sort alphabet ascending"
        color={sortByAZ ? 'blue' : ''}
        active={sortByAZ}
        basic={!sortByAZ}
        onClick={this.sortButton}
      />
    );
  };

  handleFilterChange = (e, data) => this.setState({ match: data.value });

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

  static getErrContent = (err, t) => {
    return (err.response && err.response.status === 404) 
      ? <FrownSplash text={t('messages.source-content-not-found')} />
      : <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
  };

  getContent = () => {
    const { sourceId, indexMap, language, contentLanguage, t, history, deviceInfo } = this.props;
    const index = isEmpty(sourceId) ? {} : indexMap[sourceId];
    const { err } = index || {};
    
    let content;
    
    if (err) {
      content = LibraryContainer.getErrContent(err, t);  
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

    return content;
  }

  isMobileDevice = () => {
    const { deviceInfo } = this.props;
    return deviceInfo.device && deviceInfo.device.type === 'mobile';
  };

  render() {
    const { sourceId, getSourceById, language, t, push } = this.props;
    
    const content = this.getContent();

    const { isReadable, fontSize, theme, fontType, tocIsActive, match } = this.state;

    const fullPath = this.getFullPath(sourceId);
    const parentId = this.properParentId(fullPath);
    const matchString = this.matchString(parentId, t);

    return (
      <div
        ref={this.handleContentArticleRef}
        className={classNames({
          'headroom-z-index-801': true,
          source: true,
          'is-readable': isReadable,
          'toc--is-active': tocIsActive,
          [`is-${theme}`]: true,
          [`is-${fontType}`]: true,
        })}
      >
        <Headroom>
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
        </Headroom>
        <Container>
          <Grid padded centered>
            <Grid.Row className="is-fitted">
              <Grid.Column
                mobile={16}
                tablet={16}
                computer={4}
                onClick={this.handleTocIsActive}
                className={!tocIsActive ? 'large-screen-only computer-only' : ''}>
                <TOC
                  language={language}
                  match={matchString ? match : ''}
                  fullPath={fullPath}
                  rootId={parentId}
                  contextRef={this.contextRef}
                  getSourceById={getSourceById}
                  apply={push}
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
                    style={{ minHeight: `calc(100vh - 14px)` }}
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
