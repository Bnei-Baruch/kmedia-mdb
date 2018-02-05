import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { replace } from 'react-router-redux';
import { translate } from 'react-i18next';
import { Accordion, Container, Grid, Ref, Sticky, Header, Button } from 'semantic-ui-react';

import { actions as sourceActions, selectors as sources } from '../../../redux/modules/sources';
import { selectors as settings } from '../../../redux/modules/settings';
import * as shapes from '../../shapes';
import { formatError, isEmpty } from '../../../helpers/utils';
import { ErrorSplash, FrownSplash } from '../../shared/Splash/Splash';
import LibraryContentContainer from './LibraryContentContainer';

import styles from '../../../stylesheets/includes/_layout.scss';
console.log("styles",styles);
const MainMenuHeight2 = parseInt(styles.MainMenuHeight);

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
    content: {
      data: null,
      wip: false,
      err: null,
    },
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
    accordionContext: null,
    selectedAccordionContext: null,
  };

  handleContextRef = contextRef => this.setState({ contextRef });

  handleAccordionContext         = accordionContext => this.setState({ accordionContext });
  handleSelectedAccordionContext = selectedAccordionContext => this.setState({ selectedAccordionContext });

  componentDidMount() {
    const { sourceId, areSourcesLoaded, replace } = this.props;
    if (!areSourcesLoaded) {
      return;
    }
    const firstLeafId = this.firstLeafId(sourceId);
    if (firstLeafId !== sourceId || this.props.sourceId !== sourceId
      || this.state.lastLoadedId !== sourceId) {
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
    const { accordionContext, selectedAccordionContext }    = this.state;
    if (!areSourcesLoaded) {
      return;
    }
    if (this.state.language && language !== this.state.language) {
      this.setState({ lastLoadedId: sourceId, language: this.props.language });
      this.fetchIndices(sourceId);
      return;
    }

    const firstLeafId = this.firstLeafId(sourceId);
    if (firstLeafId !== sourceId || this.props.sourceId !== sourceId
      || this.state.lastLoadedId !== sourceId) {
      if (firstLeafId !== sourceId) {
        replace(firstLeafId);
      } else {
        this.setState({ lastLoadedId: sourceId, language: this.props.language });
        this.fetchIndices(sourceId);
      }
    }

//@TODO - David, can be state that change scroll to many times.
    if (accordionContext && selectedAccordionContext) {
      const elScrollTop = ReactDOM.findDOMNode(selectedAccordionContext).offsetTop;
      const p = accordionContext.parentElement;
      if (p.scrollTop !== elScrollTop) {
        p.scrollTop = elScrollTop;
      }
      // p.style['background-color'] = 'blue';
    }
  }

  fetchIndices = (sourceId) => {
    if (isEmpty(sourceId)) {
      return;
    }

    this.props.fetchIndex(sourceId);
  };

  header = (sourceId) => {
    const { getSourceById } = this.props;

    const { name: sourceName } = getSourceById(sourceId);
    const { name: parentName, description, parent_id: parentId } = getSourceById(this.properParentId(sourceId));
    if (parentId === undefined) {
      return <div />;
    }
    const { name: kabName, full_name: kabFullName } = getSourceById(parentId);

    let displayName = kabFullName || kabName;
    if (kabFullName && kabName) {
      displayName += ` (${kabName})`;
    }
    
    return (
      <Header size='large'>  
        <Header.Subheader><small>
          {displayName} / {`${parentName} ${description || ''} `}
          </small>
        </Header.Subheader>
        {sourceName}
      </Header>
    );
  };

  selectSourceById = (id, e) => {
    e.preventDefault();
    this.props.replace(`sources/${id}`);
    window.scrollTo(0, 0);
  };

  subToc = subTree => (
    subTree.map(sourceId => (
        this.toc(sourceId)
      )
    )
  );

  leaf = (id, title) => {
    const { sourceId } = this.props;
    let props          = {
      key: `lib-leaf-item-${id}`,
      onClick: e => this.selectSourceById(id, e),
    };
    if (id === sourceId) {
      props = { ...props, ref: this.handleSelectedAccordionContext, active: true };
    }
    return <Accordion.Title {...props}>{title}</Accordion.Title>;
  };

  toc = (sourceId, firstLevel = false) => {
    // 1. Element that has children is CONTAINER
    // 2. Element that has NO children is NOT CONTAINER (though really it may be empty container)
    // 3. If all children of first level element are NOT CONTAINERs, than it is also NOT CONTAINER

    const BS_SHAMATI               = 'qMUUn22b';
    const BS_IGROT                 = 'DVSS0xAR';
    const RB_IGROT                 = 'b8SHlrfH';
    const MR_TORA                  = 'bvA8ZB1w';
    const avoidSortingForSourceIds = [BS_SHAMATI, BS_IGROT, RB_IGROT, MR_TORA];

    const { getSourceById } = this.props;

    const { name: title, children } = getSourceById(sourceId);

    if (isEmpty(children)) { // Leaf
      const item   = this.leaf(sourceId, title);
      const result = { title: item, key: `lib-leaf-${sourceId}` };
      return [result];
    }

    const hasNoGrandsons = children.reduce((acc, curr) => acc && isEmpty(getSourceById(curr).children), true);
    let panels;
    if (hasNoGrandsons) {
      panels = children.map((leafId, idx) => {
        let { name: leafTitle, } = getSourceById(leafId);
        if (sourceId === BS_SHAMATI) {
          leafTitle = `${idx + 1}. ${leafTitle}`;
        }

        const item = this.leaf(leafId, leafTitle);
        return { title: item, key: `lib-leaf-${leafId}` };
      });
    } else {
      panels = this.subToc(children);
    }

    if (firstLevel) {
      if (!avoidSortingForSourceIds.some((a) => a === sourceId)) {
        panels.sort((a, b) => typeof a.title === 'string' ? (a.title > b.title ? 1
          : ((b.title > a.title) ? -1 : 0))
          : (a.title.props.children > b.title.props.children ? 1
            : ((b.title.props.children > a.title.props.children) ? -1 : 0)));
      }

      return panels;
    }

    return {
      title,
      content: {
        content: <Accordion.Accordion panels={panels} />,
        key: `lib-content-${sourceId}`,
      }
    };
  };

  firstLeafId = (sourceId) => {
    const { getSourceById } = this.props;

    const { children } = getSourceById(sourceId) || { children: [] };
    if (isEmpty(children)) {
      return sourceId;
    }

    return this.firstLeafId(children[0]);
  };

  properParentId = (sourceId) => {
    // Go to the root of this sourceId
    const { getPathByID } = this.props;

    if (getPathByID === undefined) {
      return sourceId;
    }

    const path = getPathByID(sourceId);

    return path[1] ? path[1].id : sourceId;
  };

  render() {
    const { contextRef }                      = this.state;
    const { indexMap, sourceId, language, t } = this.props;

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
      content = <LibraryContentContainer source={this.props.sourceId} index={index} languageUI={language} t={t} />;
    }

    const parent = this.properParentId(this.props.sourceId);

    return (
      <div className="source is-readble">
        <div className="layout__secondary-header">
          <Container>
            <Grid padded >
              <Grid.Row>
                <Grid.Column width={4}>
                  <Header size='medium'>
                    {t('sources-library.toc')}
                  </Header>
                </Grid.Column>
                <Grid.Column width={6}>
                  {this.header(this.props.sourceId)}
                </Grid.Column>
                <Grid.Column width={2}>
                  <Button.Group basic size='tiny' floated='right'>
                    <Button icon='expand' />
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
                <Sticky context={contextRef} offset={144} className="source__toc">
                  <Ref innerRef={this.handleAccordionContext}>
                    <Accordion fluid panels={this.toc(parent, true)} />
                  </Ref>
                </Sticky>
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
    replace,
  }, dispatch)
)(translate()(LibraryContainer)));
