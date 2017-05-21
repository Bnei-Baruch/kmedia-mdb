import React from 'react';
// import PropTypes from 'prop-types';

import { Grid } from 'semantic-ui-react';

import MenuRoutes from './router';

import MenuItems from './menu';

import TreeNode from './treeNode';

class Sources extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tree    : [],
      language: 'ru',
    };
  }

  // componentDidMount() {
  //   FetchSources(null, {
  //     language: this.state.language,
  //   }, this.handleDataFetch);
  // }
  //
  // handleDataFetch = (collections) => {
  //   this.setState({
  //     tree: collections,
  //   });
  // };

  render() {
    return (
      <Grid columns="equal" className="main-content container">
        <Grid.Row>
          <Grid.Column width={3} only="computer" className="main-menu">
            <MenuItems simple routes={MenuRoutes} />
          </Grid.Column>
          <Grid.Column>
            <Grid padded>
              <Grid.Row stretched>
                <Grid.Column width={16}>
                  {this.state.tree.map(node => <TreeNode key={`${node.code}-t`} node={node} />)}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

// Topics.propTypes = {};

export default Sources;
