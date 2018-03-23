import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';
import { replace as routerReplace } from 'react-router-redux';
import classnames from 'classnames';
import { translate } from 'react-i18next';
import { Button, Container, Dropdown, Grid, Header, Popup, Menu, Label, Input, } from 'semantic-ui-react';

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
    areSourcesLoaded: PropTypes.bool,
    t: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
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
    tocisactive: false,
    fontSize: 0,
    theme: 'light',
    match: '',
  };

  componentDidMount() {
    this.updateSticky();
    window.addEventListener('resize', this.updateSticky);
    window.addEventListener('load', this.updateSticky);

    const { sourceId, areSourcesLoaded, replace } = this.props;
    if (!areSourcesLoaded) {
      return;
    }
    const firstLeafId = this.firstLeafId(sourceId);
    if (firstLeafId !== sourceId ||
      this.props.sourceId !== sourceId ||
      this.state.lastLoadedId !== sourceId) {
      if (firstLeafId !== sourceId) {
        replace(`sources/${firstLeafId}`);
      } else {
        // eslint-disable-next-line react/no-did-mount-set-state
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
    if (firstLeafId !== sourceId ||
      this.props.sourceId !== sourceId ||
      this.state.lastLoadedId !== sourceId) {
      if (firstLeafId === sourceId) {
        this.loadNewIndices(sourceId, this.props.language);
      } else {
        replace(firstLeafId);
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

  handleHeaderMenuRef = (ref) => {
    console.log('handleHeaderMenuRef', ref);
    this.headerMenuRef = ref;
  };

  handleTocIsActive = () => {
    this.setState({ tocisactive: !this.state.tocisactive });
  }

  handleIsReadable = () => {
    this.setState({ isReadable: !this.state.isReadable });
  };

  handleIncreaseFontSize = (e, data) => {
    if (this.state.fontSize < 6) {
      this.setState({ fontSize: this.state.fontSize + 1 });
    }
  };

  handleDecreaseFontSize = (e, data) => {
    if (this.state.fontSize > -2) {
      this.setState({ fontSize: this.state.fontSize - 1 });
    }
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
    if (isEmpty(sourceId)) {
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

    return (
      <Header size="small">
        <Header.Subheader>
          <small>
            {displayName} / {`${parentName} ${description || ''} `}
          </small>
        </Header.Subheader>
        {sourceName}
      </Header>
    );
  };

  properParentId = path => (path[1].id);

  loadNewIndices = (sourceId, language) => {
    this.setState({ lastLoadedId: sourceId, language });
    this.fetchIndices(sourceId);
  };

  sortButton = (sortOrder, title) => (
    <Button
      icon
      active={this.props.sortBy === sortOrder}
      title={title}
      onClick={() => this.props.sourcesSortBy(sortOrder)}
      compact
    >
      {title}
    </Button>
  );

  switchSortingOrder = (parentId, t) => {
    if (this.props.NotToSort.findIndex(a => a === parentId) !== -1) {
      return null;
    }
    return (
      <Button.Group basic className="buttons-language-selector" size="mini">
        {this.sortButton('AZ', t('sources-library.az'))}
        {this.sortButton('Book', t('sources-library.default'))}
      </Button.Group>
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
    if (this.props.NotToSort.findIndex(a => a === parentId) !== -1) {
      return null;
    }
    return (
      <Input
        icon="search"
        placeholder={t('sources-library.filter')}
        value={this.state.match}
        onChange={this.handleFilterChange}
        onKeyDown={this.handleFilterKeyDown}
        size="mini"
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

    const { isReadable, fontSize, theme, secondaryHeaderHeight, tocisactive, match, } = this.state;
    const matchString = this.matchString(parentId, t);

    return (
      <div className={classnames({ 
        source: true,
        'is-readable': isReadable,
        'toc--is-active': tocisactive,
        [`is-${theme}`]: true,
         })}>
        <div className="layout__secondary-header" ref={this.handleSecondaryHeaderRef}>
          <Container>
            <Grid padded centered>
              <Grid.Row verticalAlign="bottom">
                <Grid.Column tablet={5} computer={4}  className="mobile-hidden">
                  <Header size="small">{t('sources-library.toc')}</Header>
                  {this.switchSortingOrder(parentId, t)}
                  {matchString}
                </Grid.Column>
                <Grid.Column mobile={16} tablet={11} computer={12} className="source__content-header">
                  <div>
                    <div className="mobile-hidden">{this.header(sourceId, fullPath)}</div>
                    <Popup
                      trigger={<Button icon='setting' />}
                      
                      on='click'
                      position='bottom right'
                    >
                      <Popup.Content>
                        <Menu vertical>
                        
                        <Menu.Header>font size</Menu.Header>
                        
                        <Menu.Item icon="plus" name="Increase font size" onClick={this.handleIncreaseFontSize} />
                        <Menu.Item icon="minus" name="Decrease font size" onClick={this.handleDecreaseFontSize} />
                        
                        <Menu.Header>theme</Menu.Header>
                        <Menu.Item onClick={this.handleLightTheme}>
                          <Label color="white" empty circular/>
                          Light theme
                        </Menu.Item>
                        <Menu.Item onClick={this.handleDarkTheme}>
                          <Label color="black" empty circular/>
                          Dark theme
                        </Menu.Item>
                        <Menu.Item onClick={this.handleSepiaTheme}>
                          <Label color="sepia" empty circular/>
                          Sepia theme
                        </Menu.Item>
                      
                        </Menu>
                      </Popup.Content>
                    </Popup>
                    <Button icon={isReadable ? 'compress' : 'expand'} onClick={this.handleIsReadable} />
                    <Button className="mobile-only" icon="list layout" onClick={this.handleTocIsActive} />
                    
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </div>
        <Container style={{ paddingTop: `${secondaryHeaderHeight}px` }}>
          <Grid padded centered>
            <Grid.Row>
              <Grid.Column mobile={16} tablet={5} computer={4} onClick={this.handleTocIsActive}>
                <TOC
                  match={matchString ? match : ''}
                  matchApplied={this.handleFilterClear}
                  fullPath={fullPath}
                  rootId={parentId}
                  contextRef={this.contextRef}
                  getSourceById={getSourceById}
                  replace={this.props.replace}
                  stickyOffset={secondaryHeaderHeight + (isReadable ? 0 : 60) + 14}
                  t={t}
                />
              </Grid.Column>
              <Grid.Column
                mobile={14}
                tablet={11}
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
    NotToSort: sources.NotToSort
  }),
  dispatch => bindActionCreators({
    fetchIndex: sourceActions.fetchIndex,
    sourcesSortBy: sourceActions.sourcesSortBy,
    replace: routerReplace,
  }, dispatch)
)(translate()(LibraryContainer)));
