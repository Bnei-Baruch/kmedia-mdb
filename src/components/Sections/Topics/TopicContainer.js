import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List, Container, Header, Divider, Input } from 'semantic-ui-react';
import { translate } from 'react-i18next';
import debounce from 'lodash/debounce';

import { TOPICS_FOR_DISPLAY } from '../../../helpers/consts';
import { selectors } from '../../../redux/modules/tags';
import SectionHeader from '../../shared/SectionHeader';
import Link from '../../Language/MultiLanguageLink';

/* root will be main title
  subroot will be subtitle
  the rest will be a tree - List of Lists */

class TopicContainer extends Component {
  static propTypes = {
    roots: PropTypes.arrayOf(PropTypes.string),
    byId: PropTypes.object,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    roots: []
  };

  state = {
    match: '',
    displayRoots: []
  }

  componentDidMount() {
    this.initRoots(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.roots !== nextProps.roots) {
      this.initRoots(nextProps);
    }
  }

  // filter stuff

  getRegExp = (match) => {
    const escapedMatch = match.replace(/[/)(.+\\]/g, '\\$&');
    const reg          = new RegExp(escapedMatch, 'i');

    return reg;
  }

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

  initRoots = (props) => {
    const { roots } = props;
    const displayRoots = roots.filter(x => TOPICS_FOR_DISPLAY.indexOf(x) !== -1);

    this.setState({ displayRoots });
  }

  filteredById = {}

  filterTagsById = (byId) => {
    const { match, displayRoots } = this.state;

    if (!match) {
      this.filteredById = byId;
      return displayRoots;
    }

    this.filteredById = {};
    const parentIdsArr = [];
    const regExp = this.getRegExp(match);

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
    let i = 0;
    let index;
    while (i < parentIdsArr.length) {
      const parent = byId[parentIdsArr[i]];

      // keep displayRoot index for the order of the roots
      if (!parent.parent_id) {
        index = displayRoots.indexOf(parent.id);
        if (index > -1 && !displayRootIndexes.includes(index)) {
          displayRootIndexes.push(index);
        }
      } else if (parent.parent_id && !parentIdsArr.includes(parent.parent_id)) {
        parentIdsArr.push(parent.parent_id);
      }

      i++;
    }

    displayRootIndexes.sort();
    const filteredRoots = displayRootIndexes.map(ind => displayRoots[ind]);

    // add the parents to filteredById
    parentIdsArr.forEach((parentKey) => {
      this.filteredById[parentKey] = byId[parentKey];
    });

    return filteredRoots;
  }

  isIncluded = id => (this.filteredById[id]);

  hasChildren = node => (Array.isArray(node.children) && node.children.length > 0);

  renderLeaf = node => (
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
        <Header as="h3" className="topics__subtitle">
          <Link to={`/topics/${node.id}`}>
            {node.label}
          </Link>
        </Header>
        {this.renderNode(node)}
      </Fragment> :
      null
  );

  renderBranch = (rootId) => {
    const rootNode = this.filteredById[rootId];

    if (!rootNode.children || root.children.length === 0) {
      return null;
    }

    return (
      <div key={rootId} className="topics__section">
        <Header as="h1" className="topics__title">
          <Link to={`/topics/${rootNode.id}`}>
            {rootNode.label}
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
    const { byId, t } = this.props;
    // run filter
    const filteredRoots = this.filterTagsById(byId);

    return (
      <div>
        <SectionHeader section="topics" />
        <Divider fitted />
        <Input
          fluid
          size="small"
          icon="search"
          className="search-omnibox"
          placeholder={t('sources-library.filter')}
          value={this.state.match}
          onChange={this.handleFilterChange}
          onKeyDown={this.handleFilterKeyDown}
        />
        <Container className="padded">
          {filteredRoots.map(r => this.renderBranch(r))}
        </Container>
      </div>
    );
  }
}

export default connect(
  state => ({
    roots: selectors.getRoots(state.tags),
    byId: selectors.getTags(state.tags),
  })
)(translate()(TopicContainer));
