import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Input } from 'semantic-ui-react';

import * as shapes from '../../shapes';
import { OmniBox, wrap } from '../../Search/OmniBox';

class MyOmniBox extends OmniBox {

  componentDidMount() {
    this.input.focus();
  }

  renderInput() {
    const {t} = this.props;
    return (
      <Input
        ref={(c) => {
          this.input = c;
        }}
        onKeyDown={this.handleSearchKeyDown}
        action={{ content: t('buttons.search').toLowerCase(), onClick: this.handleIconClick }}
        icon={null}
        placeholder={`${t('buttons.search')}...`}
        style={{ width: '100%' }}
      />
    );
  }
}

const MyWrappedOmniBox = wrap(MyOmniBox);

class SearchBar extends Component {

  static propTypes = {
    t: PropTypes.func.isRequired,
    location: shapes.HistoryLocation.isRequired,
  };


  render() {
    const { t, location } = this.props;

    return (
      <div className="homepage__header">
        <Grid centered>
          <Grid.Row>
            <Grid.Column computer={12} tablet={14} mobile={16}>
              <Header as="h1" content={t('home.search')} color="blue" className="homepage__title" />
            </Grid.Column>
            <Grid.Column computer={12} tablet={14} mobile={16}>
              <div className="homepage__search">
                <MyWrappedOmniBox t={t} location={location} />
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default SearchBar;
