import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { withNamespaces } from 'react-i18next';
import { Container, Divider } from 'semantic-ui-react';

import * as shapes from '../../../../shapes';
import ResultsPageHeader from '../../../../Pagination/ResultsPageHeader';
import filterComponents from '../../../../Filters/components/index';
import Filters from '../../../../Filters/Filters';
import WipErr from '../../../../shared/WipErr/WipErr';
import List from './List';

const filters = {
  conventions: [
    {name: 'locations-filter', component: filterComponents.LocationsFilter},
    {name: 'years-filter', component: filterComponents.YearsFilter},
    {name: 'language-filter', component: filterComponents.LanguageFilter},
  ],
  holidays: [
    {name: 'holidays-filter', component: filterComponents.HolidaysFilter},
    {name: 'years-filter', component: filterComponents.YearsFilter},
    {name: 'language-filter', component: filterComponents.LanguageFilter},
  ],
  picnics: [
    {name: 'years-filter', component: filterComponents.YearsFilter}
  ],
  'unity-days': [
    {name: 'years-filter', component: filterComponents.YearsFilter},
    {name: 'language-filter', component: filterComponents.LanguageFilter},
  ],
};

const TabPage = ({tabName, items = [], wip = false, err = null, t}) => {
  const content = WipErr({ wip, err, t }) || (
    <Container className="padded">
      <ResultsPageHeader pageNo={1} pageSize={1000} total={items.length} />
      <Divider fitted />
      <List items={items} />
    </Container>
  );

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

TabPage.propTypes = {
  tabName: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(shapes.EventCollection),
  wip: shapes.WIP,
  err: shapes.Error,
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(TabPage);
