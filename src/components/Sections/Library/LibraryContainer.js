import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';
import { push as routerPush } from 'react-router-redux';
import classnames from 'classnames';
import { translate } from 'react-i18next';
import { Button, Container, Grid, Header, Icon, Input, Menu, Popup, Ref } from 'semantic-ui-react';

import { formatError, isEmpty } from '../../../helpers/utils';
import { actions as sourceActions, selectors as sources } from '../../../redux/modules/sources';
import { selectors as settings } from '../../../redux/modules/settings';
import * as shapes from '../../shapes';
import { ErrorSplash, FrownSplash } from '../../shared/Splash/Splash';
import LibraryContentContainer from './LibraryContentContainer';
import TOC from './TOC';

class LibraryContainer extends Component {
  static propTypes = {
    sourceId: PropTypes.string.isRequired,
    indexMap: PropTypes.objectOf(PropTypes.shape({
      data: PropTypes.object, // content index
      wip: shapes.WIP,
      err: shapes.Error,
    })),
    language: PropTypes.string.isRequired,
    fetchIndex: PropTypes.func.isRequired,
    sourcesSortBy: PropTypes.func.isRequired,
    getSourceById: PropTypes.func.isRequired,
    getPathByID: PropTypes.func,
    sortBy: PropTypes.string.isRequired,
    NotToSort: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    NotToFilter: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    areSourcesLoaded: PropTypes.bool,
    t: PropTypes.func.isRequired,
    apply: PropTypes.func.isRequired,
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

    const { sourceId, areSourcesLoaded, apply } = this.props;
    if (!areSourcesLoaded) {
      return;
    }

    const firstLeafId = this.firstLeafId(sourceId);
    if (firstLeafId !== sourceId ||
      this.props.sourceId !== sourceId ||
      this.state.lastLoadedId !== sourceId) {
      if (firstLeafId !== sourceId) {
        apply(`sources/${firstLeafId}`);
      } else {
        // eslint-disable-next-line react/no-did-mount-set-state
        this.setState({ lastLoadedId: sourceId, language: this.props.language });
        this.fetchIndices(sourceId);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { sourceId, areSourcesLoaded, language, apply } = nextProps;
    if (!areSourcesLoaded) {
      return;
    }
    if (this.state.language && language !== this.state.language) {
      this.loadNewIndices(sourceId, this.props.language);
      return;
    }

    const firstLeafId = this.firstLeafId(sourceId);
    if (firstLeafId !== sourceId ||
      this.props.sourceId !== sourceId ||
      this.state.lastLoadedId !== sourceId) {
      if (firstLeafId === sourceId) {
        this.loadNewIndices(sourceId, this.props.language);
      } else {
        apply(firstLeafId);
      }
    }

    // @TODO - David, can be state that change scroll to many times.
    if (!isEmpty(this.accordionContext) && !isEmpty(this.selectedAccordionContext)) {
      // eslint-disable-next-line react/no-find-dom-node
      const elScrollTop = ReactDOM.findDOMNode(this.selectedAccordionContext).offsetTop;
      const p           = this.accordionContext.parentElement;
      if (p.scrollTop !== elScrollTop) {
        p.scrollTop = elScrollTop;
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

    if (getPathByID === undefined) {
      return [{ id: '0' }, { id: sourceId }];
    }

    return getPathByID(sourceId);
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

  handleAccordionContext = (ref) => {
    this.accordionContext = ref;
  };

  handleSelectedAccordionContext = (ref) => {
    this.selectedAccordionContext = ref;
  };

  handleSecondaryHeaderRef = (ref) => {
    this.secondaryHeaderRef = ref;
  };

  handleContentHeaderRef = (ref) => {
    this.contentHeaderRef = ref;
  };

  handleHeaderMenuRef = (ref) => {
    this.headerMenuRef = ref;
  };

  handleTocIsActive = () => {
    this.setState({ tocIsActive: !this.state.tocIsActive });
  };

  handleIsReadable = () => {
    this.setState({ isReadable: !this.state.isReadable });
  };

  handleIncreaseFontSize = () => {
    if (this.state.fontSize < 5) {
      this.setState({ fontSize: this.state.fontSize + 1 });
    }
  };

  handleDecreaseFontSize = () => {
    if (this.state.fontSize > -3) {
      this.setState({ fontSize: this.state.fontSize - 1 });
    }
  };

  handleSerifFont = () => {
    this.setState({ fontType: 'serif' });
  };

  handleSansSerifFont = () => {
    this.setState({ fontType: 'sans-serif' });
  };

  handleLightTheme = () => {
    this.setState({ theme: 'light' });
  };

  handleDarkTheme = () => {
    this.setState({ theme: 'dark' });
  };

  handleSepiaTheme = () => {
    this.setState({ theme: 'sepia' });
  };

  fetchIndices = (sourceId) => {
    if (isEmpty(sourceId) || !isEmpty(this.props.indexMap[sourceId])) {
      return;
    }

    this.props.fetchIndex(sourceId);
  };

  header = (sourceId, fullPath) => {
    const { getSourceById } = this.props;

    const { name: sourceName }                                   = getSourceById(sourceId);
    const { name: parentName, description, parent_id: parentId } = getSourceById(this.properParentId(fullPath));
    if (parentId === undefined) {
      return <div />;
    }
    const { name: kabName, full_name: kabFullName } = getSourceById(parentId);

    let displayName = kabFullName || kabName;
    if (kabFullName && kabName) {
      displayName += ` (${kabName})`;
    }
    const { contentHeaderWidth, } = this.state;
    return (

      <Header size="small">
        <Ref innerRef={this.handleContentHeaderRef}>
          <div />
        </Ref>
        <Header.Subheader>
          <small style={{ width: `${contentHeaderWidth}px` }}>
            {displayName} / {`${parentName} ${description || ''} `}
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
    let sortOrder;
    if (this.props.sortBy === 'AZ') {
      sortOrder = 'Book';
    } else {
      sortOrder = 'AZ';
    }
    this.props.sourcesSortBy(sortOrder);
  };

  switchSortingOrder = (parentId) => {
    if (this.props.NotToSort.findIndex(a => a === parentId) !== -1) {
      return null;
    }

    return (
      <Button
        compact
        size="small"
        icon="sort alphabet ascending"
        color={this.props.sortBy === 'AZ' ? 'blue' : ''}
        active={this.props.sortBy === 'AZ'}
        basic={this.props.sortBy !== 'AZ'}
        onClick={this.sortButton}
      />
    );
  };

  handleFilterChange = (e, data) => {
    this.setState({ match: data.value });
  };

  handleFilterKeyDown = (e) => {
    if (e.keyCode === 27) { // Esc
      this.handleFilterClear();
    }
  };

  handleFilterClear = () => {
    this.setState({ match: '' });
  };

  matchString = (parentId, t) => {
    if (this.props.NotToFilter.findIndex(a => a === parentId) !== -1) {
      return null;
    }
    return (
      <Input
        fluid
        size="mini"
        icon="search"
        placeholder={t('sources-library.filter')}
        value={this.state.match}
        onChange={this.handleFilterChange}
        onKeyDown={this.handleFilterKeyDown}
      />
    );
  };

  render() {
    const { sourceId, indexMap, getSourceById, language, t } = this.props;

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
      content = (
        <LibraryContentContainer
          source={sourceId}
          index={index}
          languageUI={language}
          langSelectorMount={this.headerMenuRef}
          t={t}
        />
      );
    }

    const { isReadable, fontSize, theme, fontType, secondaryHeaderHeight, tocIsActive, match, } = this.state;

    const matchString = this.matchString(parentId, t);

    return (
      <div
        className={classnames({
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
                    <Button compact size="small" className="computer-hidden large-screen-hidden widescreen-hidden" icon="list layout" onClick={this.handleTocIsActive} />
                  </div>
                </Grid.Column>
                <Grid.Column mobile={16} tablet={16} computer={12} className="source__content-header">
                  <div className="source__header-title">{this.header(sourceId, fullPath)}</div>
                  <div className="source__header-toolbar">
                    <Popup
                      trigger={<Button compact size="small" icon="options" />}
                      on="click"
                      position="bottom right"
                      className="sources-settings"
                      flowing
                    >
                      <Popup.Content>
                        <Menu fluid widths={2}>
                          <Menu.Item onClick={this.handleIncreaseFontSize}>
                            <Icon name="font" size="large" />
                            <Icon name="plus" size="small" />
                          </Menu.Item>
                          <Menu.Item onClick={this.handleDecreaseFontSize}>
                            <Icon name="font" size="large" />
                            <Icon name="minus" size="small" />
                          </Menu.Item>
                        </Menu>
                        <Menu fluid widths={2}>
                          <Menu.Item
                            className="is-serif"
                            name="Serif"
                            onClick={this.handleSerifFont}
                          />
                          <Menu.Item name="Sans-serif" onClick={this.handleSansSerifFont} />
                        </Menu>
                        <Menu fluid widths={3}>
                          <Menu.Item
                            name="Light"
                            onClick={this.handleLightTheme}
                          />
                          <Menu.Item name="Dark" onClick={this.handleDarkTheme} />
                          <Menu.Item name="Sepia" onClick={this.handleSepiaTheme} />
                        </Menu>
                      </Popup.Content>
                    </Popup>
                    <Button compact size="small" icon={isReadable ? 'compress' : 'expand'} onClick={this.handleIsReadable} />
                    <Button compact size="small" className="computer-hidden large-screen-hidden widescreen-hidden" icon="list layout" onClick={this.handleTocIsActive} />
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
                  match={matchString ? match : ''}
                  matchApplied={this.handleFilterClear}
                  fullPath={fullPath}
                  rootId={parentId}
                  contextRef={this.contextRef}
                  getSourceById={getSourceById}
                  apply={this.props.apply}
                  stickyOffset={secondaryHeaderHeight + (isReadable ? 0 : 60)}
                  t={t}
                />
              </Grid.Column>
              <Grid.Column
                mobile={16}
                tablet={16}
                computer={12}
                className={classnames({
                  'source__content-wrapper': true,
                  [`size${fontSize}`]: true,
                })}
              >
                <div ref={this.handleContextRef}>
                  <div
                    className="source__content"
                    style={{ minHeight: `calc(100vh - ${secondaryHeaderHeight + (isReadable ? 0 : 60) + 14}px)` }}
                  >
                    {content}
                  </div>
                </div>
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
    indexMap: sources.getIndexById(state.sources),
    content: sources.getContent(state.sources),
    language: settings.getLanguage(state.settings),
    getSourceById: sources.getSourceById(state.sources),
    getPathByID: sources.getPathByID(state.sources),
    sortBy: sources.sortBy(state.sources),
    areSourcesLoaded: sources.areSourcesLoaded(state.sources),
    NotToSort: sources.NotToSort,
    NotToFilter: sources.NotToFilter,
  }),
  dispatch => bindActionCreators({
    fetchIndex: sourceActions.fetchIndex,
    sourcesSortBy: sourceActions.sourcesSortBy,
    apply: routerPush,
  }, dispatch)
)(translate()(LibraryContainer)));
