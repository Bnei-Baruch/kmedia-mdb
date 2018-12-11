import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { List, Container, Header, Divider, Input, Icon } from 'semantic-ui-react';

import { selectors } from '../../../redux/modules/tags';
import SectionHeader from '../../shared/SectionHeader';
import Link from '../../Language/MultiLanguageLink';

/* root will be main title
  subroot will be subtitle
  the rest will be a tree - List of Lists */

class TopicContainer extends Component {
  static propTypes = {
    roots: PropTypes.arrayOf(PropTypes.string),
    // eslint-disable-next-line
    byId: PropTypes.object,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    roots: []
  };

  state = {
    match: '',
  };

  // filter stuff

  getRegExp = (match) => {
    const escapedMatch = match.replace(/[/)(.+\\]/g, '\\$&');
    return new RegExp(escapedMatch, 'i');
  };

  handleFilterChange = debounce((e, data) => {
    this.setState({ match: data.value });
  }, 100);

  handleFilterKeyDown = (e) => {
    if (e.keyCode === 27) { // Esc
      this.handleFilterClear();
    }
  };

  handleFilterClear = () => {
    this.setState({ match: '' });
  };

  filteredById = {};

  filterTagsById = () => {
    const { roots, byId } = this.props;
    const { match }       = this.state;

    if (!match) {
      this.filteredById = byId;
      return roots;
    }

    this.filteredById  = {};
    const parentIdsArr = [];
    const regExp       = this.getRegExp(match);

    // filter objects
    Object.keys(byId).forEach((key) => {
      const currentObj = byId[key];

      // add object that includes the match
      if (currentObj.label && regExp.test(currentObj.label)) {
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
        index = roots.indexOf(parent.id);
        if (index > -1 && !displayRootIndexes.includes(index)) {
          displayRootIndexes.push(index);
        }
      } else if (parent.parent_id && !parentIdsArr.includes(parent.parent_id)) {
        parentIdsArr.push(parent.parent_id);
      }

      i++;
    }

    displayRootIndexes.sort();
    const filteredRoots = displayRootIndexes.map(ind => roots[ind]);

    // add the parents to filteredById
    parentIdsArr.forEach((parentKey) => {
      this.filteredById[parentKey] = byId[parentKey];
    });

    return filteredRoots;
  };

  isIncluded = id => (this.filteredById[id]);

  hasChildren = node => (Array.isArray(node.children) && node.children.length > 0);

  renderLeaf = node => (
    // eslint-disable-next-line
    <Link to={`/topics/${node.id}`}>
      {node.label}
    </Link>
  );

  renderNode = node => (
    node ?
      <Fragment>
        {
          this.hasChildren(node) ?
            <List>
              {
                node.children
                  .filter(this.isIncluded)
                  .map(id => (
                    <List.Item key={id}>
                      {this.renderNode(this.filteredById[id])}
                    </List.Item>
                  ))
              }
            </List> :
            this.renderLeaf(node)
        }
      </Fragment> :
      null
  );

  renderSubHeader = node => (
    this.hasChildren(node) ?
      <Fragment key={node.id}>
        <Header as="h4" className="topics__subtitle">
          {node.label}
          <Link to={`/topics/${node.id}`}>
            <Icon size="small" name="chain" />
          </Link>
        </Header>
        {this.renderNode(node)}
      </Fragment> :
      null
  );

  renderBranch = (rootId) => {
    const rootNode = this.filteredById[rootId];

    if (!rootNode.children || rootNode.children.length === 0) {
      return null;
    }

    return (
      <div key={rootId} className="topics__section">
        <Header as="h2" className="topics__title">
          {rootNode.label}
          <Link to={`/topics/${rootNode.id}`}>
            <Icon size="small" name="chain" />
          </Link>
        </Header>
        <div className="topics__list">
          {
            rootNode.children
              .filter(this.isIncluded)
              .map(id => this.renderSubHeader(this.filteredById[id]))
          }
        </div>
        <Divider />
      </div>
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
            size="large"
            icon="search"
            className="search-omnibox"
            placeholder={t('sources-library.filter')}
            value={this.state.match}
            onChange={this.handleFilterChange}
            onKeyDown={this.handleFilterKeyDown}
          />
        </Container>
        <Container className="padded">
          {filteredRoots.map(r => this.renderBranch(r))}
        </Container>
      </div>
    );
  }
}

export default connect(
  state => ({
    roots: selectors.getDisplayRoots(state.tags),
    byId: selectors.getTags(state.tags),
  })
)(translate()(TopicContainer));
