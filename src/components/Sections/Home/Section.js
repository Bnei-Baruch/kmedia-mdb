import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Divider, Grid } from 'semantic-ui-react';
import * as shapes from '../../shapes';

class Section extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    children: shapes.Children.isRequired,
  };

  render() {
    const { title, children } = this.props;

    return (
      <Grid centered padded="vertically">
        <Grid.Row>
          <Grid.Column computer={15} tablet={15} mobile={16}>
            <Divider horizontal fitted>{title}</Divider>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column computer={12} tablet={14} mobile={16}>
            {children}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default Section;
