import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Input } from 'semantic-ui-react';

import withIsMobile from '../../../helpers/withIsMobile';
import * as shapes from '../../shapes';
import { OmniBox, wrap } from '../../Search/OmniBox';

class MyOmniBox extends OmniBox {
  static propTypes = {
    isMobileDevice: PropTypes.bool.isRequired,
  };

  renderInput() {
    const { t, isMobileDevice } = this.props;
    return (
      <Input
        autoFocus={!isMobileDevice}
        onKeyDown={this.handleSearchKeyDown}
        action={{ content: t('buttons.search').toLowerCase(), onClick: this.handleIconClick }}
        icon={null}
        placeholder={`${t('buttons.search')}...`}
        style={{ width: '100%' }}
        type="search"
      />
    );
  }
}

const MyWrappedOmniBox = withIsMobile(wrap(MyOmniBox));

class SearchBar extends Component {
  static propTypes = {
    location: shapes.HistoryLocation.isRequired,
    t: PropTypes.func.isRequired,
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
