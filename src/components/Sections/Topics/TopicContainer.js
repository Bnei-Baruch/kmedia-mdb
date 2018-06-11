import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { /*Grid,*/ List, Container, Item } from 'semantic-ui-react';
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

  renderLeaf(node){
    return(
      <Link to={`/topics/${node.id}`}>
        {node.label}
      </Link>
    );
  }

  renderNode(node){
    const {byId} = this.props;

    return(
        <List.Description>
          {
            (Array.isArray(node.children) && node.children.length > 0) ?
              <List relaxed>
                {
                  node.children.map(id => 
                    <List.Item key={id}>
                      <List.Content>
                        {this.renderNode(byId[id])}
                      </List.Content>  
                    </List.Item>  
                  )
                }
             </List> :
              this.renderLeaf(node)
          }
        </List.Description>
    );
  }

  renderSubHeader(node){
    return(
      <List key={node.id} relaxed='very'>
        <List.Item>
          <List.Content>
            <List.Header as='h3'> 
              {node.label} 
            </List.Header>
            { this.renderNode(node) }
          </List.Content>
        </List.Item>
      </List>
    );
  }

  renderBranch(rootId){
    const { byId } = this.props;
    const rootNode = byId[rootId];
    const rootChildren = rootNode.children;

    return (
      <Item.Content key={rootId}>
        <Item.Header as='h2'> {rootNode.label} </Item.Header>
        <Item.Description>
          {
            Array.isArray(rootChildren) && rootChildren.length > 0 ?
              rootChildren.map(id => this.renderSubHeader(byId[id])) :
              this.renderSubHeader(rootChildren)
          }
        </Item.Description>
      </Item.Content>
    );
  }
  
  render(){
    const {roots} = this.props;
    console.log('roots:',roots);

    return(
      <Container fluid>
        <SectionHeader section="topics" />
        <Item.Group divided relaxed unstackable>
            {
              roots.map(r => 
                <Item key={r}> 
                  {this.renderBranch(r)}
                </Item>
              )
            }
        </Item.Group>  

        {/* <Grid container doubling divided relaxed>
          {
            this.props.roots.map(r => 
              <Grid.Column key={r} mobile={16} tablet={8} computer={4}> 
                {this.renderBranch(r)}
              )
              </Grid.Column>)
          }
        </Grid> */}
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