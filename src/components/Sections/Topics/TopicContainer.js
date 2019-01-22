import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import debounce from 'lodash/debounce';
import { connect } from 'react-redux';
import { Button, Container, Divider, Grid, Header, Input, List } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';

import { actions as topicsActions, selectors as topicsSelectors } from '../../../redux/modules/tags';
import { selectors as statsSelectors } from '../../../redux/modules/stats';
import { isEmpty } from '../../../helpers/utils';
import SectionHeader from '../../shared/SectionHeader';
import Link from '../../Language/MultiLanguageLink';
import {
  COLLECTION_EVENTS_TYPE,
  COLLECTION_LESSONS_TYPE,
  COLLECTION_PROGRAMS_TYPE,
  COLLECTION_PUBLICATIONS_TYPE,
  CT_ARTICLE,
  CT_PUBLICATION,
  TOPICS_FOR_DISPLAY,
  UNIT_EVENTS_TYPE,
  UNIT_LESSONS_TYPE,
  UNIT_PROGRAMS_TYPE
} from '../../../helpers/consts';

/* root will be main title
  subroot will be subtitle
  the rest will be a tree - List of Lists */

class TopicContainer extends Component {
  static propTypes = {
    roots: PropTypes.arrayOf(PropTypes.string),
    // eslint-disable-next-line
    byId: PropTypes.object,
    t: PropTypes.func.isRequired,
    stats: PropTypes.objectOf(PropTypes.number),
    fetchStats: PropTypes.func.isRequired
  };

  static defaultProps = {
    roots: [],
    stats: []
  };

  state = {
    match: '',
    expandedNodes: []
  };

  filteredById = {};

  handleFilterChange = debounce((e, data) => {
    this.setState({ match: data.value });
  }, 100);

  componentDidMount() {
    const { fetchStats } = this.props;
    const namespace      = 'topics';
    const contentType    = [
      ...UNIT_EVENTS_TYPE,
      ...UNIT_EVENTS_TYPE,
      ...UNIT_PROGRAMS_TYPE,
      ...UNIT_LESSONS_TYPE,
      ...COLLECTION_PUBLICATIONS_TYPE,
      ...COLLECTION_EVENTS_TYPE,
      ...COLLECTION_PROGRAMS_TYPE,
      ...COLLECTION_LESSONS_TYPE,
      CT_ARTICLE,
      CT_PUBLICATION,
    ];

    fetchStats(namespace, contentType);
  }

  // filter stuff

  getRegExp = (match) => {
    const escapedMatch = match.replace(/[/)(.+\\]/g, '\\$&');
    return new RegExp(escapedMatch, 'i');
  };

  setVisibleState = (byId) => {
    const visibleItemsCount = 3;
    const list              = byId || {};
    Object.keys(list).forEach((key) => {
      const { id, parent_id: parentId } = list[key];
      const { expandedNodes }           = this.state;
      let visible                       = true;
      if (parentId) {
        visible = expandedNodes[parentId] || list[parentId].children.indexOf(id) < visibleItemsCount;
      }

      list[key] = { ...list[key], visible };
    });

    return list;
  };

  handleFilterKeyDown = (e) => {
    if (e.keyCode === 27) { // Esc
      this.handleFilterClear();
    }
  };

  handleFilterClear = () => {
    this.setState({ match: '' });
  };

  sortRootsPosition = (roots) => {
    const extra = roots.filter(node => !TOPICS_FOR_DISPLAY.includes(node));

    return roots.length ? [...TOPICS_FOR_DISPLAY, ...extra] : roots;
  };

  filterTagsById = () => {
    const { roots, byId } = this.props;
    const { match }       = this.state;
    const sortedRoots     = this.sortRootsPosition(roots);

    if (!match) {
      this.filteredById = this.setVisibleState(byId);
      return sortedRoots;
    }

    this.filteredById  = {};
    const parentIdsArr = [];
    const regExp       = this.getRegExp(match);

    // filter objects
    Object.keys(byId).forEach((key) => {
      const currentObj = byId[key];

      // add object that includes the match
      if (currentObj.label && regExp.test(currentObj.label)) {
        currentObj.visible     = true;
        this.filteredById[key] = currentObj;

        // keep its parent_id key
        if (currentObj.parent_id) {
          parentIdsArr.push(currentObj.parent_id);
        }
      }
    });

    // add grand parents ids till the root to parentIdsArr
    const displayRootIndexes = []; // to keep the same order of the roots
    let i                    = 0;
    let index;
    while (i < parentIdsArr.length) {
      const parent = byId[parentIdsArr[i]];

      // keep displayRoot index for the order of the roots
      if (!parent.parent_id) {
        index = sortedRoots.indexOf(parent.id);
        if (index > -1 && !displayRootIndexes.includes(index)) {
          displayRootIndexes.push(index);
        }
      } else if (parent.parent_id && !parentIdsArr.includes(parent.parent_id)) {
        parentIdsArr.push(parent.parent_id);
      }

      i++;
    }

    displayRootIndexes.sort();
    const filteredRoots = displayRootIndexes.map(ind => sortedRoots[ind]);

    // add the parents to filteredById
    parentIdsArr.forEach((parentKey) => {
      this.filteredById[parentKey] = byId[parentKey];
    });

    return filteredRoots;
  };

  isIncluded = id => (this.filteredById[id]);

  hasChildren = node => (Array.isArray(node.children) && node.children.length > 0);

  updateParentsVisibleState = (parentId) => {
    const { expandedNodes } = this.state;
    expandedNodes[parentId] = !expandedNodes[parentId];
    this.setState({ expandedNodes });
  };

  renderLeaf = (node) => {
    const { stats } = this.props;

    // eslint-disable-next-line
    return (
      <Link to={`/topics/${node.id}`}>
        {node.label}
        {stats && stats[node.id] ? ` (${stats[node.id]})` : ''}
      </Link>
    );
  };

  renderChildren = children => (
    children
      .filter(this.isIncluded)
      .map(id => (
        <List.Item key={id} className={`${children.visible ? '' : 'hide-topic'}`}>
          {this.renderNode(this.filteredById[id])}
        </List.Item>
      ))
  );

  renderNode = (node, grandchildrenClass = '') => {
    const { t }             = this.props;
    const { expandedNodes } = this.state;
    const showExpandButton  = node.children && node.children.length > 3;
    return node ? (
      <Fragment key={`f-${node.id}`}>
        {
          this.hasChildren(node) ? (
            <div key={node.id} className={`topics__card ${grandchildrenClass}`}>
              <Header as="h4" className="topics__subtitle">
                <Link to={`/topics/${node.id}`}>
                  {node.label}
                </Link>
              </Header>
              <List>
                {
                  node.children
                    .filter(this.isIncluded)
                    .map(id => (
                      <List.Item key={id} className={this.filteredById[id].visible ? '' : 'hide-topic'}>
                        {this.renderNode(this.filteredById[id], 'grandchildren')}
                      </List.Item>
                    ))
                }
              </List>
              <Button
                basic
                icon={expandedNodes[node.id] ? 'minus' : 'plus'}
                className={`topics__button ${showExpandButton ? '' : 'hide-button'}`}
                size="mini"
                content={t(`topics.show-${expandedNodes[node.id] ? 'less' : 'more'}`)}
                onClick={() => this.updateParentsVisibleState(node.id)}
              />
            </div>
          ) : this.renderLeaf(node)
        }
      </Fragment>
    ) : null;
  };

  renderSubHeader = node => (
    this.hasChildren(node) ? this.renderNode(node)
      : null
  );

  renderBranch = (rootId) => {
    const rootNode = this.filteredById[rootId];

    if (!rootNode.children || rootNode.children.length === 0) {
      return null;
    }

    return (
      <Grid.Column key={rootId} className="topics__section">
        <Header as="h2" className="topics__title">
          {rootNode.label}
        </Header>
        <div className="topics__list">
          {
            rootNode.children
              .filter(this.isIncluded)
              .map(id => this.renderSubHeader(this.filteredById[id]))
          }
        </div>
      </Grid.Column>
    );
  };

  render() {
    const { t }         = this.props;
    // run filter
    const filteredRoots = this.filterTagsById();

    return (
      <div>
        <SectionHeader section="topics" />
        <Divider fitted />
        <Container className="padded">
          <Input
            fluid
            size="small"
            icon="search"
            className="search-omnibox"
            placeholder={t('sources-library.filter')}
            onChange={this.handleFilterChange}
            onKeyDown={this.handleFilterKeyDown}
          />
        </Container>
        <Container className="padded">
          <Grid columns={3}>
            <Grid.Row>
              {filteredRoots.map(r => this.renderBranch(r))}
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default connect(
  (state) => {
    let stats = statsSelectors.getCUStats(state.stats, 'topics') || { data: { tags: {} } };
    stats     = isEmpty(stats) || isEmpty(stats.data) ? null : stats.data.tags;

    return {
      roots: topicsSelectors.getDisplayRoots(state.tags),
      byId: topicsSelectors.getTags(state.tags),
      stats
    };
  },
  dispatch => bindActionCreators({
    fetchStats: topicsActions.fetchStats
  }, dispatch)
)(withNamespaces()(TopicContainer));
