import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Container } from 'semantic-ui-react';
import { connect } from 'react-redux';

import SectionHeader from '../../shared/SectionHeader';
import { TOPICS_FOR_DISPLAY } from '../../../helpers/consts';
import { selectors } from '../../../redux/modules/tags';
import Link from '../../Language/MultiLanguageLink';

class TopicContainer extends Component{

  static propTypes = {
    roots: PropTypes.arrayOf(PropTypes.string).isRequired,
    byId: PropTypes.object.isRequired,
  };

  static defaultProps = {
    roots: []
  };

  //root will be main title
  //subroot will be subtitle
  //the rest will be a tree - List of Lists

  renderNodeChildren(node, showThis){
    const byId = this.props.byId;

    return(
      <div>
        { showThis ? node.label : null }
        <List.Content>
          <List relaxed size='large'>
            {node.children.map(id => this.renderNode(byId[id]))}
          </List> 
        </List.Content> 
      </div>
    );
  }

  renderLeaf(node){
    return(
    <Link /*to={node}*/>
      {node.label}
    </Link>
    );
  }

  renderNode(node){
    return(
        <List.Item key={node.id}>
          {
            (Array.isArray(node.children) && node.children.length > 0) ?
              this.renderNodeChildren(node, true) :
              this.renderLeaf(node)
          }
        </List.Item>
    );
  }

  renderSubHeader(node){
    return(
      <List.Item key={node.id}>
        <List.Header as='h3'> {node.label} </List.Header>
        {this.renderNodeChildren(node)}
      </List.Item>
    );
  }

  renderBranch(rootId){
    const byId = this.props.byId;
    const rootNode = byId[rootId];
    const rootChildren = rootNode.children;

    return (
      <div>
        <List relaxed>
          <List.Header as='h2'>{rootNode.label}</List.Header>
          {
            Array.isArray(rootChildren) && rootChildren.length > 0 ?
              rootChildren.map(id => this.renderSubHeader(byId[id])) :
              this.renderSubHeader(rootChildren)
          }
        </List>
      </div>
    );
  }
  
  render(){
    return(
      <Container text>
        <SectionHeader section="topics" />
        <List divided relaxed='very'>
           {
             this.props.roots.map(r => 
              <List.Item key={r}> 
                {this.renderBranch(r)} 
                <br/>
              </List.Item>)
           }
        </List>
      </Container>
    );
  }

}

export default connect(
  state => ({
    roots: selectors.getRoots(state.tags).filter(x => TOPICS_FOR_DISPLAY.indexOf(x) !== -1), 
    byId: selectors.getTags(state.tags),
  })
)(TopicContainer);