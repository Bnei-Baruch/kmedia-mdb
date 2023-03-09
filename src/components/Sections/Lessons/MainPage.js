import { isEqual } from 'lodash';
import React, { useCallback, useEffect, useMemo } from 'react';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Container, Divider } from 'semantic-ui-react';

import {
  COLLECTION_DAILY_LESSONS,
  COLLECTION_LESSONS_TYPE,
  CT_DAILY_LESSON,
  CT_LECTURE,
  CT_LESSON_PART,
  CT_LESSONS_SERIES,
  CT_VIRTUAL_LESSON,
  CT_WOMEN_LESSON,
  FN_SHOW_LESSON_AS_UNITS,
  PAGE_NS_LESSONS,
  UNIT_LESSONS_TYPE
} from '../../../helpers/consts';
import { isEmpty, usePrevious } from '../../../helpers/utils';
import { selectors as filters } from '../../../redux/modules/filters';
import { actions, selectors as lists } from '../../../redux/modules/lists';
import { selectors as settings } from '../../../redux/modules/settings';

import FilterLabels from '../../FiltersAside/FilterLabels';
import Pagination from '../../Pagination/Pagination';
import ResultsPageHeader from '../../Pagination/ResultsPageHeader';
import { getPageFromLocation } from '../../Pagination/withPagination';
import SectionFiltersWithMobile from '../../shared/SectionFiltersWithMobile';
import SectionHeader from '../../shared/SectionHeader';
import WipErr from '../../shared/WipErr/WipErr';
import CollectionItem from './Collectiontem';
import DailyLessonItem from './DailyLessonItem';
import Filters from './Filters';
import UnitItem from './UnitItem';

const SHOWED_CT = [CT_VIRTUAL_LESSON, CT_WOMEN_LESSON, CT_LECTURE, CT_LESSONS_SERIES];

export const LESSON_AS_COLLECTION = [CT_DAILY_LESSON, ...SHOWED_CT];
export const LESSON_AS_UNIT       = [CT_LESSON_PART, ...SHOWED_CT];
const FILTER_PARAMS               = { content_type: LESSON_AS_UNIT };

const MainPage = ({ t }) => {
  const { items, total, wip, err } = useSelector(state => lists.getNamespaceState(state.lists, PAGE_NS_LESSONS)) || {};
  const language                   = useSelector(state => settings.getLanguage(state.settings));
  const pageSize                   = useSelector(state => settings.getPageSize(state.settings));
  const selected                   = useSelector(state => filters.getNotEmptyFilters(state.filters, PAGE_NS_LESSONS), isEqual);

  const prevSel    = usePrevious(selected);
  const listParams = useMemo(() => selected.some(f => FN_SHOW_LESSON_AS_UNITS.includes(f.name) && !isEmpty(f.values))
    ? { content_type: LESSON_AS_UNIT }
    : { content_type: LESSON_AS_COLLECTION }, [selected]);

  const dispatch = useDispatch();
  const setPage  = useCallback(pageNo => dispatch(actions.setPage(PAGE_NS_LESSONS, pageNo)), [dispatch]);

  const location = useLocation();
  const pageNo   = useMemo(() => getPageFromLocation(location) || 1, [location]);

  useEffect(() => {
    if (pageNo !== 1 && !!prevSel && prevSel !== selected) {
      setPage(1);
    } else {
      dispatch(actions.fetchSectionList(PAGE_NS_LESSONS, pageNo, {
        pageSize,
        withViews: true,
        ...listParams
      }));
    }
  }, [language, dispatch, pageNo, selected, listParams]);

  const wipErr          = WipErr({ wip, err, t });
  const filterComponent = <Filters namespace={PAGE_NS_LESSONS} baseParams={FILTER_PARAMS} />;
  return (<>
    <SectionHeader section="lessons" />
    <SectionFiltersWithMobile filters={filterComponent}>
      <ResultsPageHeader pageNo={pageNo} total={total} pageSize={pageSize} />
      <FilterLabels namespace={PAGE_NS_LESSONS} />
      {
        wipErr || items?.map(({ id, content_type }, i) => {
          switch (true) {
            case COLLECTION_DAILY_LESSONS.includes(content_type):
              return <DailyLessonItem id={id} key={i} />;
            case COLLECTION_LESSONS_TYPE.includes(content_type):
              return <CollectionItem id={id} key={i} />;
            case UNIT_LESSONS_TYPE.includes(content_type):
              return <UnitItem id={id} key={i} />;
            default:
              return null;
          }
        })
      }
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
    </SectionFiltersWithMobile>
  </>);
};

export default withTranslation()(MainPage);
