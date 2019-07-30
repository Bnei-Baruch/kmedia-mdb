import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {withNamespaces} from 'react-i18next';
import {Button, Grid, Header, Input, Icon} from 'semantic-ui-react';

import {selectors as device} from '../../../redux/modules/device';
import * as shapes from '../../shapes';
import {mapState as obMS, OmniBox, wrap} from '../../Search/OmniBox';
import ButtonDayPicker from "../../Filters/components/Date/ButtonDayPicker";
import moment from 'moment';

class MyOmniBox extends OmniBox {
  static propTypes = {
    deviceInfo: shapes.UserAgentParserResults.isRequired,
    language: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    props.updateQuery('');  // reset the query from search page
  }

  handleFromInputChange = (value) => {
    window.location.href = '/' + this.props.language + '/simple-mode?date=' + moment(value).format('YYYY-MM-DD');
  };

  isMobileDevice = () => this.props.deviceInfo.device && this.props.deviceInfo.device.type==='mobile';

  renderInput() {
    const {t, deviceInfo, language} = this.props;
    const isMobileDevice            = this.isMobileDevice();

    return (
      <div>
        <Input
          autoFocus={deviceInfo.device.type===undefined}  // desktop only
          onKeyDown={this.handleSearchKeyDown}
          className={'right action'}
          icon={null}
          placeholder={`${t('buttons.search')}...`}
          style={{width: '100%'}}
          type="text">
          <input/>
          <Button type='submit' className="searchButton" onClick={this.doSearchFromClickEvent}>
            <Icon name='search' size={isMobileDevice ? 'large':null}/>
            {!isMobileDevice ? t('buttons.search').toUpperCase():null}
          </Button>
          <ButtonDayPicker
            label={t('filters.date-filter.presets.CUSTOM_DAY')}
            language={language}
            deviceInfo={deviceInfo}
            onDayChange={this.handleFromInputChange}
          />
        </Input>
      </div>
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
    const {t, location} = this.props;

    return (
      <Grid centered>
        <Grid.Row>
          <Grid.Column computer={12} tablet={14} mobile={16}>
            <Header as="h1" content={t('home.search')} className="homepage__title text white"/>
          </Grid.Column>
          <Grid.Column computer={12} tablet={14} mobile={16}>
            <div className="homepage__search">
              <MyWrappedOmniBox location={location}/>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default withNamespaces()(SearchBar);
