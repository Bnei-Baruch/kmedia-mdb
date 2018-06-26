import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List, Container, Header, Divider } from 'semantic-ui-react';

import { TOPICS_FOR_DISPLAY } from '../../../helpers/consts';
import { selectors } from '../../../redux/modules/tags';
import SectionHeader from '../../shared/SectionHeader';
import Link from '../../Language/MultiLanguageLink';

class TopicContainer extends Component {
  static propTypes = {
    roots: PropTypes.arrayOf(PropTypes.string).isRequired,
    byId: PropTypes.object.isRequired,
  };

  static defaultProps = {
    roots: []
  };

  // root will be main title
  // subroot will be subtitle
  // the rest will be a tree - List of Lists

  renderLeaf = node => (
    <Link to={`/topics/${node.id}`}>
      {node.label}
    </Link>
  );

  renderNode = (node) => {
    const { byId } = this.props;

    return (
      <div>
        {
          Array.isArray(node.children) && node.children.length > 0 ?
            <List relaxed>
              {
                node.children.map(id => (
                  <List.Item key={id}>
                    {this.renderNode(byId[id])}
                  </List.Item>
                ))
              }
            </List> :
            this.renderLeaf(node)
        }
      </div>
    );
  };

  renderSubHeader = node => (
    <div key={node.id} className="topics__list">
      <Header as="h4">
        {node.label}
      </Header>
      {this.renderNode(node)}
    </div>
  );

  renderBranch = (rootId) => {
    const { byId }     = this.props;
    const rootNode     = byId[rootId];
    const rootChildren = rootNode.children;

    if (!rootChildren) {
      return null;
    }

    return (
      <div key={rootId}>
        <Header as="h2"> {rootNode.label} </Header>
        {
          rootChildren.map(id => this.renderSubHeader(byId[id]))
        }
      </div>
    );
  };

  render() {
    const { roots } = this.props;
    console.log('TopicContainer.render: roots', roots);

    return (
      <div>
        <SectionHeader section="topics" />
        <Divider hidden />
        <Container>
          {roots.map(this.renderBranch)}
        </Container>
        <Divider hidden />
      </div>
    );
  }
}

export default connect(
  state => ({
    roots: selectors.getRoots(state.tags).filter(x => TOPICS_FOR_DISPLAY.indexOf(x) !== -1),
    byId: selectors.getTags(state.tags),
  })
)(TopicContainer);
