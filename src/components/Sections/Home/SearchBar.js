import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Header } from 'semantic-ui-react';
import * as shapes from '../../shapes';
import OmniBox from '../../Search/OmniBox';

class SearchBar extends Component {

  static propTypes = {
    t: PropTypes.func.isRequired,
    location: shapes.HistoryLocation.isRequired,
    title: PropTypes.string
  };

  static defaultProps = {};

  render() {
    const { t, location, title } = this.props;

    return (
      <div className='homepage__header'>
        <Grid centered>
          <Grid.Row>
            <Grid.Column computer={12} tablet={14} mobile={16}>
              <Header as="h1" color="blue" className='homepage__title'>
                <Header.Content>
                  {title}
                </Header.Content>
              </Header>
            </Grid.Column>
            <Grid.Column computer={12} tablet={14} mobile={16}>
              <div className='homepage__search'>
                <OmniBox t={t} location={location} />
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default SearchBar;
