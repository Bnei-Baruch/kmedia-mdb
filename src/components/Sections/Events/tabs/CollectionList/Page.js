import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { translate } from 'react-i18next';
import { Container, Divider } from 'semantic-ui-react';

import { formatError } from '../../../../../helpers/utils';
import * as shapes from '../../../../shapes';
import { ErrorSplash, LoadingSplash } from '../../../../shared/Splash';
import ResultsPageHeader from '../../../../pagination/ResultsPageHeader';
import filterComponents from '../../../../Filters/components/index';
import Filters from '../../../../Filters/Filters';
import List from './List';

const filters = {
  'conventions': [
    { name: 'locations-filter', component: filterComponents.LocationsFilter },
    { name: 'years-filter', component: filterComponents.YearsFilter },
  ],
  'holidays': [
    { name: 'holidays-filter', component: filterComponents.HolidaysFilter },
    { name: 'years-filter', component: filterComponents.YearsFilter }
  ],
  'picnics': [
    { name: 'years-filter', component: filterComponents.YearsFilter }
  ],
  'unity-days': [
    { name: 'years-filter', component: filterComponents.YearsFilter }
  ],
};

class TabPage extends PureComponent {

  static propTypes = {
    tabName: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(shapes.EventCollection),
    wip: shapes.WIP,
    err: shapes.Error,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    items: [],
    wip: false,
    err: null,
  };

  render() {
    const { tabName, items, wip, err, t } = this.props;

    let content;
    if (err) {
      content = <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
    } else if (wip) {
      content = <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
    } else {
      content = (
        <Container className="padded">
          <ResultsPageHeader pageNo={1} pageSize={1000} total={items.length} />
          <Divider fitted />
          <List items={items} t={t} />
        </Container>
      );
    }

    return (
      <div>
        <Divider fitted />
        <Filters
          namespace={`events-${tabName}`}
          filters={filters[tabName]}
          onChange={noop}
          onHydrated={noop}
        />
        {content}
      </div>
    );
  }

}

export default translate()(TabPage);
