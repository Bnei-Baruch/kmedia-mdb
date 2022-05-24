import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Divider, Grid } from 'semantic-ui-react';
import { isEqual } from 'lodash';
import { usePrevious } from '../../../helpers/utils';

import { selectors as lists, actions } from '../../../redux/modules/lists';
import { selectors as settings } from '../../../redux/modules/settings';
import { selectors as filters } from '../../../redux/modules/filters';
import { actions as progActions } from '../../../redux/modules/programs';
import SectionHeader from '../../shared/SectionHeader';
import Filters from './Filters';
import FilterLabels from '../../FiltersAside/FilterLabels';
import { PAGE_NS_PROGRAMS, UNIT_PROGRAMS_TYPE } from '../../../helpers/consts';
import ContentItemContainer from '../../shared/ContentItem/ContentItemContainer';
import Pagination from '../../Pagination/Pagination';
import ResultsPageHeader from '../../Pagination/ResultsPageHeader';
import ItemOfList from './ItemOfList';

const MainPage = () => {
  const { items, total } = useSelector(state => lists.getNamespaceState(state.lists, PAGE_NS_PROGRAMS)) || {};
  const language         = useSelector(state => settings.getLanguage(state.settings));
  const pageSize         = useSelector(state => settings.getPageSize(state.settings));
  const selected         = useSelector(state => filters.getFilters(state.filters, PAGE_NS_PROGRAMS), isEqual);
  const prevSel          = usePrevious(selected);

  const [pageNo, setPageNo] = useState(1);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(progActions.fetchCollections());
  }, [language, dispatch]);

  useEffect(() => {
    let page_no = pageNo > 1 ? pageNo : 1;
    if (page_no !== 1 && prevSel !== selected) page_no = 1;

    dispatch(actions.fetchList(PAGE_NS_PROGRAMS, page_no, {
      content_type: UNIT_PROGRAMS_TYPE,
      pageSize,
      withViews: true
    }));
  }, [language, dispatch, pageNo, selected]);

  const onPageChange = n => setPageNo(n);

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
              onChange={onPageChange}
            />}
          </Container>
        </Grid.Column>
      </Grid>
    </Container>
  </>);
};

export default MainPage;
