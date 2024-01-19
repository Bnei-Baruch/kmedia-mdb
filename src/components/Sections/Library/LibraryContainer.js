import React, { Component } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { bindActionCreators } from '@reduxjs/toolkit';
import { connect } from 'react-redux';
import { push as routerPush, replace as routerReplace } from '@lagunovsky/redux-react-router';
import { withTranslation } from 'react-i18next';
import { Button, Container, Grid, Header, Input, Ref, Segment } from 'semantic-ui-react';
import Headroom from 'react-headroom';

import { isEmpty } from '../../../helpers/utils';
import { actions as assetsActions, selectors as assets } from '../../../redux/modules/assets';
import { actions as sourceActions, selectors as sources } from '../../../redux/modules/sources';
import { selectors as settings } from '../../../redux/modules/settings';
import { actions as mdbActions } from '../../../redux/modules/mdb';
import * as shapes from '../../shapes';
import { getSourceErrorSplash } from '../../shared/WipErr/WipErr';
import Helmets from '../../shared/Helmets';
import { isTaas } from '../../shared/PDF/PDF';
import Library, { buildBookmarkSource, buildLabelData } from './Library';
import TOC, { getIndex } from './TOC';
import LibraryBar from './LibraryBar';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { getQuery } from '../../../helpers/url';
import { SCROLL_SEARCH_ID } from '../../../helpers/consts';
import { withRouter } from '../../../helpers/withRouterPatch';
import TagsByUnit from '../../shared/TagsByUnit';
import { mdbGetFullUnitFetchedSelector } from '../../../redux/selectors';

const waitForRenderElement = async (attempts = 0) => {
  if (attempts > 10) return Promise.reject();
  const element = document.getElementById(SCROLL_SEARCH_ID);
  if (!element) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return waitForRenderElement(++attempts);
  }

  return element;
};

class LibraryContainer extends Component {
  static contextType = DeviceInfoContext;

  static propTypes = {
    sourceId        : PropTypes.string.isRequired,
    indexMap        : PropTypes.objectOf(shapes.DataWipErr),
    uiLang          : PropTypes.string.isRequired,
    uiDir           : PropTypes.string.isRequired,
    fetchUnit       : PropTypes.func.isRequired,
    fetchIndex      : PropTypes.func.isRequired,
    sourcesSortBy   : PropTypes.func.isRequired,
    getSourceById   : PropTypes.func.isRequired,
    getPathByID     : PropTypes.func,
    sortBy          : PropTypes.string.isRequired,
    NotToSort       : PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    NotToFilter     : PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    areSourcesLoaded: PropTypes.bool,
    t               : PropTypes.func.isRequired,
    push            : PropTypes.func.isRequired,
    replace         : PropTypes.func.isRequired,
    navigate        : PropTypes.func.isRequired
  };

  static defaultProps = {
    indexMap        : {
      data: null,
      wip : false,
      err : null
    },
    areSourcesLoaded: false,
    getPathByID     : undefined
  };

  state = {
    lastLoadedId     : null,
    isReadable       : false,
    tocIsActive      : false,
    fontSize         : 0,
    theme            : 'light',
    match            : '',
    scrollTopPosition: 0
  };

  static getFullPath = (sourceId, getPathByID) => {
    // Go to the root of this sourceId
    if (!getPathByID) {
      return [{ id: '0' }, { id: sourceId }];
    }

    const path = getPathByID(sourceId);

    if (!path || path.length < 2 || !path[1]) {
      return [{ id: '0' }, { id: sourceId }];
    }

    return path;
  };

  static nextPrevButtons = props => {
    const { sourceId, getPathByID } = props;

    if (isTaas(sourceId)) {
      return null;
    }

    const fullPath = LibraryContainer.getFullPath(sourceId, getPathByID);

    const len = fullPath.length;

    if (len < 2) {
      return null;
    }

    const activeIndex = getIndex(fullPath[len - 2], fullPath[len - 1]);
    if (activeIndex === -1) {
      return null;
    }

    const { children } = fullPath[len - 2];
    return (
      <div className="library__nextPrevButtons">
        {LibraryContainer.nextPrevLink(children, activeIndex - 1, false, props)}
        {LibraryContainer.nextPrevLink(children, activeIndex + 1, true, props)}
      </div>
    );
  };

  static getNextPrevDetails(isNext, uiDir, t) {
    const title         = isNext ? t('buttons.next-article') : t('buttons.previous-article');
    const labelPosition = isNext ? 'right' : 'left';
    const icon          = isNext ? (uiDir === 'ltr' ? 'forward' : 'backward') : (uiDir === 'ltr' ? 'backward' : 'forward');
    const buttonAlign   = isNext ? (uiDir === 'ltr' ? 'right' : 'left') : (uiDir === 'ltr' ? 'left' : 'right');

    return { title, labelPosition, buttonAlign, icon };
  }

  static nextPrevLink(children, index, isNext, { push, t, uiDir, getSourceById }) {
    if (index < 0 || index > children.length - 1) {
      return null;
    }

    const { title, labelPosition, buttonAlign, icon } = LibraryContainer.getNextPrevDetails(isNext, uiDir, t);
    const sourceId                                    = children[index];
    const source                                      = getSourceById(sourceId);
    return (
      <Button
        onClick={e => {
          push(`sources/${sourceId}`);
          e.target.blur();
        }}
        className={`library__nextPrevButton align-${buttonAlign}`}
        size="mini"
        icon={icon}
        labelPosition={labelPosition}
        content={title}
        title={source.name}/>
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { sourceId, indexMap, uiLang, sortBy, areSourcesLoaded }                                       = this.props;
    const { lastLoadedId, isReadable, fontSize, fontType, theme, tocIsActive, match, scrollTopPosition } = this.state;

    const equalProps = sourceId === nextProps.sourceId
      && uiLang === nextProps.uiLang
      && sortBy === nextProps.sortBy
      && areSourcesLoaded === nextProps.areSourcesLoaded;

    const equalIndexMap = indexMap && nextProps.indexMap && indexMap[sourceId] === nextProps.indexMap[sourceId];

    const equalState = lastLoadedId === nextState.lastLoadedId
      && isReadable === nextState.isReadable
      && tocIsActive === nextState.tocIsActive
      && fontSize === nextState.fontSize
      && fontType === nextState.fontType
      && theme === nextState.theme
      && match === nextState.match
      && scrollTopPosition === nextState.scrollTopPosition;

    return !equalProps || !equalIndexMap || !equalState;
  }

  componentDidMount() {
    this.updateSticky();
    window.addEventListener('resize', this.updateSticky);
    window.addEventListener('load', this.updateSticky);

    const { sourceId, areSourcesLoaded, location } = this.props;

    const tocIsActive = location.state?.tocIsActive || false;

    if (tocIsActive || sourceId === 'grRABASH') {
      this.setState({ tocIsActive: true });
    }

    if (!areSourcesLoaded) {
      return;
    }

    this.replaceOrFetch(sourceId);
  }

  componentDidUpdate(prevProps, prevState) {
    const { sourceId, areSourcesLoaded, getPathByID, location } = this.props;
    if (!areSourcesLoaded) {
      return;
    }

    this.replaceOrFetch(sourceId);
    this.updateSticky();

    const { isReadable, scrollTopPosition, tocIsActive, doScroll = true } = this.state;

    const { srchstart }    = getQuery(location);
    const scrollingElement = isReadable ? this.articleRef : document.scrollingElement;

    if (srchstart && doScroll) {
      waitForRenderElement(0).then(el => el && (scrollingElement.scrollTop = el.offsetTop));
      this.setState({ doScroll: false });
    }

    //on change full screen and normal view scroll to position
    if (prevState.isReadable !== isReadable && this.articleRef) {
      scrollingElement.scrollTop = scrollTopPosition;
    }

    // hide toc if only one item
    if (tocIsActive) {
      const fullPath    = LibraryContainer.getFullPath(sourceId, getPathByID);
      const activeIndex = getIndex(fullPath[1], fullPath[2]);

      if (activeIndex === -1) {
        this.setState({ tocIsActive: false });
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateSticky);
    window.removeEventListener('load', this.updateSticky);
  }

  replaceOrFetch(nextSourceId) {
    const { sourceId, replace, uiLang } = this.props;

    const firstLeafId = this.firstLeafId(nextSourceId);
    if (firstLeafId !== nextSourceId) {
      replace(`sources/${firstLeafId}`);
    } else if (sourceId !== nextSourceId
      || this.state.lastLoadedId !== nextSourceId
      || this.state.uiLang !== uiLang) {
      this.setState({ lastLoadedId: nextSourceId, uiLang });
      this.fetchIndices(nextSourceId);
    }
  }

  fetchIndices = sourceId => {
    const { indexMap, fetchIndex, fetchUnit, unitFetched } = this.props;
    if (isEmpty(sourceId) || !isEmpty(indexMap[sourceId])) {
      return;
    }

    fetchIndex(sourceId);

    if (!unitFetched) {
      fetchUnit(sourceId);
    }
  };

  firstLeafId = sourceId => {
    const { getSourceById } = this.props;

    const { children } = getSourceById(sourceId) || { children: [] };
    if (isEmpty(children)) {
      return sourceId;
    }

    return this.firstLeafId(children[0]);
  };

  // handleLangContainerRef = (ref) => this.langContainerRef = ref;

  updateSticky = () => {
    // check fixed header width in pixels for text-overflow:ellipsis
    if (this.contentHeaderRef) {
      const { width } = this.contentHeaderRef.getBoundingClientRect();
      if (this.state.contentHeaderWidth !== width) {
        this.setState({ contentHeaderWidth: width });
      }
    }
  };

  handleContextRef = ref => this.contextRef = ref;

  handleContentArticleRef = ref => this.articleRef = ref;

  handleContentHeaderRef = ref => this.contentHeaderRef = ref;

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

  handleSettings = setting => this.setState(setting);

  header = (sourceId, properParentId) => {
    const { getSourceById } = this.props;

    const source             = getSourceById(sourceId);
    const properParentSource = getSourceById(properParentId);

    if (!source || !properParentSource) {
      return <div/>;
    }

    const { name: parentName, description, parent_id: parentId } = properParentSource;
    const parentSource                                           = getSourceById(parentId);

    if (!parentSource) {
      return <Segment basic>&nbsp;</Segment>;
    }

    const { name: sourceName }                      = source;
    const { name: kabName, full_name: kabFullName } = parentSource;

    let displayName = kabFullName || kabName;
    if (kabFullName && kabName) {
      displayName += ` (${kabName})`;
    }

    const { contentHeaderWidth } = this.state;

    return (
      <Header size="small">
        <Helmets.Basic title={`${sourceName} - ${parentName} - ${kabName}`} description={description}/>
        <Ref innerRef={this.handleContentHeaderRef}>
          <div/>
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
    const sortOrder                 = sortBy === 'AZ'
      ? 'Book'
      : 'AZ';

    sourcesSortBy(sortOrder);
  };

  switchSortingOrder = parentId => {
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
        color={sortByAZ ? 'blue' : 'grey'}
        active={sortByAZ}
        basic={!sortByAZ}
        onClick={this.sortButton}
      />
    );
  };

  handleFilterChange = (e, data) => this.setState({ match: data.value });

  handleFilterKeyDown = e => {
    if (e.keyCode === 27) { // Esc
      this.setState({ match: '' });
    }
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

  getContent = () => {
    const { sourceId, indexMap, t } = this.props;
    const index                     = isEmpty(sourceId) ? {} : indexMap[sourceId];
    const { err, data }             = index || {};

    let content;

    if (err) {
      content = getSourceErrorSplash(err, t);
    } else {
      const downloadAllowed = this.context.deviceInfo.os.name !== 'iOS';

      content = (
        <Library
          source={sourceId}
          data={data}
          downloadAllowed={downloadAllowed}
        />
      );
    }

    return content;
  };

  render() {
    const
      {
        sourceId,
        getSourceById,
        getPathByID,
        uiLang,
        t,
        push,
        areSourcesLoaded
      } = this.props;

    if (!areSourcesLoaded)
      return null;

    const content = this.getContent();

    const { isReadable, fontSize, theme, fontType, tocIsActive, match } = this.state;

    const fullPath    = LibraryContainer.getFullPath(sourceId, getPathByID);
    const parentId    = this.properParentId(fullPath);
    const matchString = this.matchString(parentId, t);
    const active      = !this.context.isMobileDevice || tocIsActive;

    return (
      <div
        ref={this.handleContentArticleRef}
        className={clsx({
          'headroom-z-index-801': true,
          source                : true,
          'is-readable'         : isReadable,
          'toc--is-active'      : tocIsActive,
          [`is-${theme}`]       : true,
          [`is-${fontType}`]    : true
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
                    <div className="source__header-title">
                      {this.header(sourceId, parentId)}
                      <TagsByUnit id={sourceId}/>
                    </div>
                    <LibraryBar
                      handleSettings={this.handleSettings}
                      handleIsReadable={this.handleIsReadable}
                      handleTocIsActive={this.handleTocIsActive}
                      isReadable={isReadable}
                      fontSize={fontSize}
                      // DON'T MERGE BEFORE FIXING THIS
                      // Not sure why contentLanguage is being used here at all!
                      source={{ language: uiLang, ...buildBookmarkSource(sourceId) }}
                      label={{ language: uiLang, ...buildLabelData(sourceId) }}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Container>
          </div>
        </Headroom>
        <Container>
          <Grid padded="horizontally" centered>
            <Grid.Row>
              <Grid.Column
                mobile={16}
                tablet={16}
                computer={4}
                onClick={this.handleTocIsActive}
              >
                <TOC
                  uiLang={uiLang}
                  match={matchString ? match : ''}
                  fullPath={fullPath}
                  rootId={parentId}
                  contextRef={this.contextRef}
                  getSourceById={getSourceById}
                  apply={push}
                  active={active}
                />
              </Grid.Column>
              <Grid.Column
                mobile={16}
                tablet={16}
                computer={12}
                className={clsx({
                  'source__content-wrapper font_settings-wrapper': true,
                  [`size${fontSize}`]                            : true
                })}
              >
                <Ref innerRef={this.handleContextRef}>
                  <div
                    className="source__content font_settings"
                    style={{ minHeight: `calc(100vh - 14px)` }}
                  >
                    {content}
                    {LibraryContainer.nextPrevButtons(this.props)}
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

export default withTranslation()(withRouter(connect(
  (state, ownProps) => ({
    sourceId        : ownProps.params?.id,
    indexMap        : assets.getSourceIndexById(state.assets),
    uiLang          : settings.getUILang(state.settings),
    uiDir           : settings.getUIDir(state.settings),
    unitFetched     : mdbGetFullUnitFetchedSelector[ownProps.params?.id],
    getSourceById   : sources.getSourceById(state.sources),
    getPathByID     : sources.getPathByID(state.sources),
    sortBy          : sources.sortBy(state.sources),
    areSourcesLoaded: sources.areSourcesLoaded(state.sources),
    NotToSort       : sources.NotToSort,
    NotToFilter     : sources.NotToFilter
  }),
  dispatch => bindActionCreators({
    fetchUnit    : mdbActions.fetchUnit,
    fetchIndex   : assetsActions.sourceIndex,
    sourcesSortBy: sourceActions.sourcesSortBy,
    push         : routerPush,
    replace      : routerReplace
  }, dispatch)
)(LibraryContainer)));
