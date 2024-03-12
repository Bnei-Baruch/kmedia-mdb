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
import { actions } from '../../../redux/modules/lists';

import FilterLabels from '../../FiltersAside/FilterLabels';
import Pagination from '../../Pagination/Pagination';
import ResultsPageHeader from '../../Pagination/ResultsPageHeader';
import { getPageFromLocation } from '../../Pagination/withPagination';
import SectionFiltersWithMobile from '../../shared/SectionFiltersWithMobile';
import SectionHeader from '../../shared/SectionHeader';
import WipErr from '../../shared/WipErr/WipErr';
import CollectionItem from './Filters/Collectiontem';
import DailyLessonItem from './Filters/DailyLessonItem';
import Filters from './Filters';
import UnitItem from './Filters/UnitItem';
import {
  settingsGetContentLanguagesSelector,
  listsGetNamespaceStateSelector,
  filtersGetNotEmptyFiltersSelector,
  settingsGetPageSizeSelector
} from '../../../redux/selectors';

const SHOWED_CT = [CT_VIRTUAL_LESSON, CT_WOMEN_LESSON, CT_LECTURE, CT_LESSONS_SERIES];

export const LESSON_AS_COLLECTION = [CT_DAILY_LESSON, ...SHOWED_CT];
export const LESSON_AS_UNIT       = [CT_LESSON_PART, ...SHOWED_CT];
const FILTER_PARAMS               = { content_type: LESSON_AS_UNIT };

const MainPage = ({ t }) => {
  const { items, total, wip, err } = useSelector(state => listsGetNamespaceStateSelector(state, PAGE_NS_LESSONS)) || {};
  const contentLanguages           = useSelector(settingsGetContentLanguagesSelector);
  const pageSize                   = useSelector(settingsGetPageSizeSelector);
  const selected                   = useSelector(state => filtersGetNotEmptyFiltersSelector(state, PAGE_NS_LESSONS), isEqual);

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
  }, [contentLanguages, dispatch, pageNo, selected, listParams]);

  const wipErr          = WipErr({ wip, err, t });
  const filterComponent = <Filters namespace={PAGE_NS_LESSONS} baseParams={FILTER_PARAMS}/>;

  return (
    <>
      <SectionHeader section="lessons"/>
      <SectionFiltersWithMobile filters={filterComponent} namespace={PAGE_NS_LESSONS}>
        <ResultsPageHeader pageNo={pageNo} total={total} pageSize={pageSize}/>
        <FilterLabels namespace={PAGE_NS_LESSONS}/>
        {
          wipErr || items?.filter(({ id }) => !!id)
            .map(({ id, content_type }) => {
              switch (true) {
                case COLLECTION_DAILY_LESSONS.includes(content_type):
                  return <DailyLessonItem id={id} key={id}/>;
                case COLLECTION_LESSONS_TYPE.includes(content_type):
                  return <CollectionItem id={id} key={id}/>;
                case UNIT_LESSONS_TYPE.includes(content_type):
                  return <UnitItem id={id} key={id}/>;
                default:
                  return null;
              }
            })
        }
        <Divider fitted/>
        <Container className="padded pagination-wrapper" textAlign="center">
          {total > 0 && <Pagination
            pageNo={pageNo}
            pageSize={pageSize}
            total={total}
            onChange={setPage}
          />}
        </Container>
      </SectionFiltersWithMobile>
    </>
  );
};

export default withTranslation()(MainPage);
