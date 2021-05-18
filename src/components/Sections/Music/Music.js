import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Container, Divider } from 'semantic-ui-react';

import ResultsPageHeader from '../../Pagination/ResultsPageHeader';
import SectionHeader from '../../shared/SectionHeader';
import WipErr from '../../shared/WipErr/WipErr';
import { selectors, actions } from '../../../redux/modules/music';
import List from './List';
// import filterComponents from '../../Filters/components/index';
// import Filters from '../../Filters/Filters';
// import { noop } from '../../../helpers/utils';

// const filters = [
//   { name: 'date-filter', component: filterComponents.DateFilter },
// ];

const Music = ({ t }) => {
  const wip = useSelector(state => selectors.getWip(state.music));
  const err = useSelector(state => selectors.getError(state.music));
  const items = useSelector(state => selectors.getMusicData(state.music));
  const [dataLoaded, setDataLoaded] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!wip && !err && !dataLoaded) {
      dispatch(actions.fetchMusic());
      setDataLoaded(true);
    }

  }, [dispatch, wip, err, dataLoaded]);

  // console.log('items:', items);

  const content = WipErr({ wip, err, t }) || (
    <Container className="padded">
      <ResultsPageHeader pageNo={1} pageSize={1000} total={items.length || 0} />
      <Divider fitted />
      <List items={items} />
    </Container>
  );

  return (
    <>
      <SectionHeader section="music" />
      <Divider fitted />
      {/* <Filters
        namespace="music"
        filters={filters}
        onChange={noop}
        onHydrated={noop}
      /> */}
      {content}
    </>
  );
}

Music.propTypes = {
  t: PropTypes.func.isRequired,
}

export default withNamespaces()(Music);
