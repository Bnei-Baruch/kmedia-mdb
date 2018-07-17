import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List, Container, Header, Divider } from 'semantic-ui-react';

import { TOPICS_FOR_DISPLAY } from '../../../helpers/consts';
import { selectors } from '../../../redux/modules/tags';
import SectionHeader from '../../shared/SectionHeader';
import Link from '../../Language/MultiLanguageLink';

class TopicContainer extends Component {
  static propTypes = {
    roots: PropTypes.arrayOf(PropTypes.string),
    byId: PropTypes.object.isRequired,
  };

  static defaultProps = {
    roots: []
  };

  /* root will be main title
  subroot will be subtitle
  the rest will be a tree - List of Lists */

  renderLeaf = node => (
    <Link to={`/topics/${node.id}`}>
      {node.label}
    </Link>
  );

  renderNode = (node) => {
    const { byId } = this.props;

    return (
      <Fragment>
        {
          Array.isArray(node.children) && node.children.length > 0 ?
            <List>
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
      </Fragment>
    );
  };

  renderSubHeader = node => (
    <Fragment key={node.id}>
      <Header as="h3" className="topics__subtitle">
        <Link to={`/topics/${node.id}`}>
          {node.label}
        </Link>
      </Header>
      {this.renderNode(node)}
    </Fragment>
  );

  renderBranch = (rootId) => {
    const { byId }     = this.props;
    const rootNode     = byId[rootId];
    const rootChildren = rootNode.children;

    if (!rootChildren) {
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
            rootChildren.map(id => this.renderSubHeader(byId[id]))
          }
        </div>
          <Divider />
      </div>
    );
  };

  render() {
    const { roots } = this.props;

    return (
      <div>
        <SectionHeader section="topics" />
        <Divider fitted />
        <Container className="padded">
          {roots.map(this.renderBranch)}
        </Container>
        
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
