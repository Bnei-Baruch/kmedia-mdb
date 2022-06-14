import { isEqual } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Divider, Grid } from 'semantic-ui-react';

import { CT_FRIENDS_GATHERING, CT_MEAL, EVENT_PAGE_CTS, EVENT_TYPES, PAGE_NS_EVENTS, } from '../../../helpers/consts';
import { usePrevious } from '../../../helpers/utils';
import { selectors as filters } from '../../../redux/modules/filters';
import { actions, selectors as lists } from '../../../redux/modules/lists';
import { selectors as settings } from '../../../redux/modules/settings';
import FilterLabels from '../../FiltersAside/FilterLabels';
import Pagination from '../../Pagination/Pagination';
import ResultsPageHeader from '../../Pagination/ResultsPageHeader';
import SectionHeader from '../../shared/SectionHeader';
import CollectionItem from './CollectionItem';
import Filters from './Filters';
import UnitItem from './UnitItem';

const MainPage = () => {
  const { items, total } = useSelector(state => lists.getNamespaceState(state.lists, PAGE_NS_EVENTS)) || {};
  const language         = useSelector(state => settings.getLanguage(state.settings));
  const pageSize         = useSelector(state => settings.getPageSize(state.settings));
  const selected         = useSelector(state => filters.getFilters(state.filters, PAGE_NS_EVENTS), isEqual);
  const prevSel          = usePrevious(selected);

  const [pageNo, setPageNo] = useState(1);

  const dispatch = useDispatch();
  useEffect(() => {
    let page_no = pageNo > 1 ? pageNo : 1;
    if (page_no !== 1 && prevSel !== selected) page_no = 1;

    dispatch(actions.fetchListLessons(PAGE_NS_EVENTS, page_no, { pageSize, content_type: EVENT_PAGE_CTS }));
  }, [language, dispatch, pageNo, selected]);

  const onPageChange = n => setPageNo(n);

  return (<>
    <SectionHeader section="events" />
    <Container className="padded" fluid>
      <Divider />
      <Grid divided>
        <Grid.Column width="4" className="filters-aside-wrapper">
          <Filters
            namespace={PAGE_NS_EVENTS}
            baseParams={{ content_type: EVENT_PAGE_CTS }}
          />
        </Grid.Column>
        <Grid.Column width="12">
          <ResultsPageHeader pageNo={pageNo} total={total} pageSize={pageSize} />
          <FilterLabels namespace={PAGE_NS_EVENTS} />
          {
            items?.map(({ id, content_type }, i) => {
                switch (true) {
                case EVENT_TYPES.includes(content_type):
                  return <CollectionItem id={id} key={i} />;
                case [CT_MEAL, CT_FRIENDS_GATHERING].includes(content_type):
                  return <UnitItem id={id} key={i} />;
                default:
                  return null;
                }
              }
            )
          }
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
