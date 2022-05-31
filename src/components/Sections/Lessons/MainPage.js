import { isEqual } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Divider, Grid } from 'semantic-ui-react';

import { actions, selectors as lists } from '../../../redux/modules/lists';
import { selectors as settings } from '../../../redux/modules/settings';
import { selectors as filters } from '../../../redux/modules/filters';
import {
  COLLECTION_LESSONS_TYPE,
  CT_DAILY_LESSON,
  PAGE_NS_LESSONS,
  UNIT_LESSONS_TYPE,
  UNIT_PROGRAMS_TYPE
} from '../../../helpers/consts';
import { usePrevious } from '../../../helpers/utils';
import SectionHeader from '../../shared/SectionHeader';
import ResultsPageHeader from '../../Pagination/ResultsPageHeader';
import FilterLabels from '../../FiltersAside/FilterLabels';
import Pagination from '../../Pagination/Pagination';
import Filters from './Filters';
import CollectionItem from './Collectiontem';
import DailyLessonItem from './DailyLessonItem';
import UnitItem from './UnitItem';

const MainPage = () => {
  const { items, total } = useSelector(state => lists.getNamespaceState(state.lists, PAGE_NS_LESSONS)) || {};
  const language         = useSelector(state => settings.getLanguage(state.settings));
  const pageSize         = useSelector(state => settings.getPageSize(state.settings));
  const selected         = useSelector(state => filters.getFilters(state.filters, PAGE_NS_LESSONS), isEqual);
  const prevSel          = usePrevious(selected);

  const [pageNo, setPageNo] = useState(1);

  const dispatch = useDispatch();
  useEffect(() => {
    let page_no = pageNo > 1 ? pageNo : 1;
    if (page_no !== 1 && prevSel !== selected) page_no = 1;

    dispatch(actions.fetchListLessons(PAGE_NS_LESSONS, page_no, {
      pageSize,
      withViews: true,
      content_type: [...UNIT_LESSONS_TYPE, ...COLLECTION_LESSONS_TYPE]
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
            namespace={PAGE_NS_LESSONS}
            baseParams={{ content_type: [...UNIT_LESSONS_TYPE, ...COLLECTION_LESSONS_TYPE] }}
          />
        </Grid.Column>
        <Grid.Column width="12">
          <ResultsPageHeader pageNo={pageNo} total={total} pageSize={pageSize} />
          <FilterLabels namespace={PAGE_NS_LESSONS} />
          {
            items?.map(({ id, content_type }, i) => {
                switch (true) {
                case content_type === CT_DAILY_LESSON:
                  return <DailyLessonItem id={id} key={i} />;
                case COLLECTION_LESSONS_TYPE.includes(content_type):
                  return <CollectionItem id={id} key={i} />;
                case UNIT_LESSONS_TYPE.includes(content_type):
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
