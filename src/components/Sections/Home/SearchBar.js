import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Grid, Header, Input } from 'semantic-ui-react';

import { selectors as device } from '../../../redux/modules/device';
import * as shapes from '../../shapes';
import { mapState as obMS, OmniBox, wrap } from '../../Search/OmniBox';

class MyOmniBox extends OmniBox {
  static propTypes = {
    deviceInfo: shapes.UserAgentParserResults.isRequired,
  };

  constructor(props) {
    super(props);
    props.updateQuery('');  // reset the query from search page
  }

  renderInput() {
    const { t, deviceInfo } = this.props;
    return (
      <Input
        autoFocus={deviceInfo.device.type === undefined}  // desktop only
        onKeyDown={this.handleSearchKeyDown}
        action={{ content: t('buttons.search').toLowerCase(), onClick: this.doSearchFromClickEvent }}
        icon={null}
        placeholder={`${t('buttons.search')}...`}
        style={{ width: '100%' }}
        type="search"
      />
    );
  }
}

const MyWrappedOmniBox = wrap(withNamespaces()(MyOmniBox), state => ({
  ...obMS(state),
  deviceInfo: device.getDeviceInfo(state.device),
}));

class SearchBar extends Component {
  static propTypes = {
    location: shapes.HistoryLocation.isRequired,
    t: PropTypes.func.isRequired,
  };

  render() {
    const { t, location } = this.props;

    return (
      <Grid centered>
        <Grid.Row>
          <Grid.Column computer={12} tablet={14} mobile={16}>
            <Header as="h1" content={t('home.search')} className="homepage__title text white" />
          </Grid.Column>
          <Grid.Column computer={12} tablet={14} mobile={16}>
            <div className="homepage__search">
              <MyWrappedOmniBox location={location} />
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default withNamespaces()(SearchBar);
