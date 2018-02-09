import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';
import { replace as routerReplace } from 'react-router-redux';
import { translate } from 'react-i18next';
import { Button, Container, Grid, Header, } from 'semantic-ui-react';

import { formatError, isEmpty } from '../../../helpers/utils';
import { actions as sourceActions, selectors as sources } from '../../../redux/modules/sources';
import { selectors as settings } from '../../../redux/modules/settings';
import * as shapes from '../../shapes';
import { ErrorSplash, FrownSplash } from '../../shared/Splash/Splash';
import LibraryContentContainer from './LibraryContentContainer';
import TOC from './TOC';
// import styles from '../../../stylesheets/includes/_layout.scss';

// const MainMenuHeight2 = parseInt(styles.MainMenuHeight, 10);

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
    getSourceById: PropTypes.func.isRequired,
    getPathByID: PropTypes.func,
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
  };

  componentDidMount() {
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

  getFullPath = (sourceId) => {
    // Go to the root of this sourceId
    const { getPathByID } = this.props;

    if (getPathByID === undefined) {
      return [{ id: '0' }, { id: sourceId }];
    }

    return getPathByID(sourceId);
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
      <Header size="large">
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

  render() {
    const { sourceId, indexMap, getSourceById, language, t } = this.props;

    const fullPath = this.getFullPath(sourceId);
    const parent   = this.properParentId(fullPath);

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
          t={t}
        />
      );
    }

    return (
      <div className="source is-readble">
        <div className="layout__secondary-header">
          <Container>
            <Grid padded>
              <Grid.Row>
                <Grid.Column width={4}>
                  <Header size="medium">
                    {t('sources-library.toc')}
                  </Header>
                </Grid.Column>
                <Grid.Column width={6}>
                  {this.header(sourceId, fullPath)}
                </Grid.Column>
                <Grid.Column width={2}>
                  <Button.Group basic size="tiny" floated="right">
                    <Button icon="expand" />
                  </Button.Group>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </div>
        <Container>
          <Grid padded divided>
            <Grid.Row>
              <Grid.Column width={4}>
                <TOC
                  fullPath={fullPath}
                  rootId={parent}
                  contextRef={this.contextRef}
                  getSourceById={getSourceById}
                  replace={this.props.replace}
                />
              </Grid.Column>
              <Grid.Column width={8}>
                {/* {MainMenuHeight2} */}
                <div ref={this.handleContextRef}>
                  <div className="source__content">
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
    areSourcesLoaded: sources.areSourcesLoaded(state.sources),
  }),
  dispatch => bindActionCreators({
    fetchIndex: sourceActions.fetchIndex,
    replace: routerReplace,
  }, dispatch)
)(translate()(LibraryContainer)));
