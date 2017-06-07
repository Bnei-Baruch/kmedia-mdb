import React, { Component } from 'react';
import { Grid, Header } from 'semantic-ui-react';

class Design extends Component {

  render() {
    return (
      <Grid.Column width={16}>
        <Header content="Oleg's design experiments" />
      </Grid.Column>
    );
  }
}

export default Design;
