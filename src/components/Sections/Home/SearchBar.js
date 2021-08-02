import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router';
import { withNamespaces } from 'react-i18next';
import { Button, Grid, Header, Icon, Input } from 'semantic-ui-react';
import { mapState as obMS, OmniBox, wrap } from '../../Search/OmniBox';
import ButtonDayPicker from '../../Filters/components/Date/ButtonDayPicker';
import moment from 'moment';
import { ClientChroniclesContext, DeviceInfoContext } from '../../../helpers/app-contexts';

class MyOmniBox extends OmniBox {
  static contextType = DeviceInfoContext;
  static propTypes   = {
    language: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    props.updateQuery('');  // reset the query from search page
  }

  handleFromInputChange = value => {
    window.location.href = `/${  this.props.language  }/simple-mode?date=${  moment(value).format('YYYY-MM-DD')}`;
  };

  renderInput() {
    const { t, language }                = this.props;
    const { deviceInfo, isMobileDevice } = this.context;

    return (
      <div>
        <Input
          autoFocus={deviceInfo.device.type === undefined}  // desktop only
          onKeyDown={this.handleSearchKeyDown}
          className={'right action'}
          icon={null}
          placeholder={`${t('buttons.search')}...`}
          style={{ width: '100%' }}
          type="text">
          <input />
          <Button type='submit' className="searchButton" onClick={this.doSearchFromClickEvent}>
            <Icon name='search' size={isMobileDevice ? 'large' : null} />
            {!isMobileDevice ? t('buttons.search').toUpperCase() : null}
          </Button>
          <ButtonDayPicker
            label={t('filters.date-filter.presets.CUSTOM_DAY')}
            language={language}
            onDayChange={this.handleFromInputChange}
          />
        </Input>
      </div>
    );
  }
}

const MyWrappedOmniBox = wrap(withNamespaces()(MyOmniBox), state => ({
  ...obMS(state)
}));

const SearchBar = ({ t }) => {
  const location = useLocation();
  const chronicles = useContext(ClientChroniclesContext);

  return (
    <Grid centered>
      <Grid.Row>
        <Grid.Column computer={12} tablet={14} mobile={16}>
          <Header as="h1" content={t('home.search')} className="homepage__title text white" />
        </Grid.Column>
        <Grid.Column computer={12} tablet={14} mobile={16}>
          <div className="homepage__search">
            <MyWrappedOmniBox location={location} chronicles={chronicles} />
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

SearchBar.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(SearchBar);
