import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Container, Divider } from 'semantic-ui-react';

import ResultsPageHeader from '../../Pagination/ResultsPageHeader';
import filterComponents from '../../Filters/components/index';
import Filters from '../../Filters/Filters';
import SectionHeader from '../../shared/SectionHeader';
import WipErr from '../../shared/WipErr/WipErr';
import { selectors } from '../../../redux/modules/events';
import { noop } from '../../../helpers/utils';
import List from '../Events/tabs/CollectionList/List';


const filters = [
  { name: 'date-filter', component: filterComponents.DateFilter },
];

const Music = ({ t }) => {
  const wip = useSelector(state => selectors.getWip(state.events));
  const err = useSelector(state => selectors.getError(state.events));
  const items = [];

  const content = WipErr({ wip, err, t }) || (
    <Container className="padded">
      <ResultsPageHeader pageNo={1} pageSize={1000} total={items.length} />
      <Divider fitted />
      <List items={items} />
    </Container>
  );

  return (
    <>
      <SectionHeader section="music" />
      <Divider fitted />
      <Filters
        namespace="music"
        filters={filters}
        onChange={noop}
        onHydrated={noop}
      />
      {content}
    </>
  );
}

Music.propTypes = {
  t: PropTypes.func.isRequired,
}

export default withNamespaces()(Music);
