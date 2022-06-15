import { isEqual } from 'lodash';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Container, Divider, Grid } from 'semantic-ui-react';
import { PAGE_NS_PROGRAMS, UNIT_PROGRAMS_TYPE } from '../../../helpers/consts';
import { usePrevious } from '../../../helpers/utils';
import { selectors as filters } from '../../../redux/modules/filters';

import { actions, selectors as lists } from '../../../redux/modules/lists';
import { actions as progActions } from '../../../redux/modules/programs';
import { selectors as settings } from '../../../redux/modules/settings';
import FilterLabels from '../../FiltersAside/FilterLabels';
import Pagination from '../../Pagination/Pagination';
import ResultsPageHeader from '../../Pagination/ResultsPageHeader';
import { getPageFromLocation } from '../../Pagination/withPagination';
import SectionHeader from '../../shared/SectionHeader';
import Filters from './Filters';
import ItemOfList from './ItemOfList';

const MainPage = () => {
  const { items, total } = useSelector(state => lists.getNamespaceState(state.lists, PAGE_NS_PROGRAMS)) || {};
  const language         = useSelector(state => settings.getLanguage(state.settings));
  const pageSize         = useSelector(state => settings.getPageSize(state.settings));
  const selected         = useSelector(state => filters.getFilters(state.filters, PAGE_NS_PROGRAMS), isEqual);
  const prevSel          = usePrevious(selected);

  const location = useLocation();
  const pageNo   = useMemo(() => getPageFromLocation(location) || 1, [location]);

  const dispatch = useDispatch();
  const setPage  = useCallback(pageNo => dispatch(actions.setPage(PAGE_NS_PROGRAMS, pageNo)), [dispatch]);

  useEffect(() => {
    dispatch(progActions.fetchCollections());
  }, [language, dispatch]);

  useEffect(() => {
    if (pageNo !== 1 && !!prevSel && prevSel !== selected) {
      setPage(1);
    } else {
      dispatch(actions.fetchList(PAGE_NS_PROGRAMS, pageNo, {
        content_type: UNIT_PROGRAMS_TYPE,
        pageSize,
        withViews: true
      }));
    }

  }, [language, dispatch, pageNo, selected]);

  return (<>
    <SectionHeader section="programs" />
    <Container className="padded" fluid>
      <Divider />
      <Grid divided>
        <Grid.Column width="4" className="filters-aside-wrapper">
          <Filters
            namespace={PAGE_NS_PROGRAMS}
            baseParams={{ content_type: UNIT_PROGRAMS_TYPE }}
          />
        </Grid.Column>
        <Grid.Column width="12">
          <ResultsPageHeader pageNo={pageNo} total={total} pageSize={pageSize} />
          <FilterLabels namespace={PAGE_NS_PROGRAMS} />
          {items?.map((id, i) => <ItemOfList id={id} key={i} />)}
          <Divider fitted />
          <Container className="padded pagination-wrapper" textAlign="center">
            {total > 0 && <Pagination
              pageNo={pageNo}
              pageSize={pageSize}
              total={total}
              language={language}
              onChange={setPage}
            />}
          </Container>
        </Grid.Column>
      </Grid>
    </Container>
  </>);
};

export default MainPage;
