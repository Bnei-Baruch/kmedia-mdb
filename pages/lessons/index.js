import React, { useCallback, useEffect, Suspense } from 'react';
import { useTranslation } from 'next-i18next';
import { useDispatch, useSelector } from 'react-redux';
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
} from '../../src/helpers/consts';
import { isEmpty } from '../../src/helpers/utils';
import { usePrevious } from '../../src/helpers/hooks';
import { filterSlice } from '../../lib/redux/slices/filterSlice/filterSlice';
import { selectors as lists } from '../../lib/redux/slices/listSlice/listSlice';
import { selectors as settings } from '../../lib/redux/slices/settingsSlice/settingsSlice';

import Pagination from '../../src/components/Pagination/Pagination';
import ResultsPageHeader from '../../src/components/Pagination/ResultsPageHeader';
import SectionFiltersWithMobile from '../../src/components/shared/SectionFiltersWithMobile';
import SectionHeader from '../../src/components/shared/SectionHeader';
import WipErr from '../../src/components/shared/WipErr/WipErr';
import CollectionItem from '../../src/components/Sections/Lessons/Collectiontem';
import DailyLessonItem from '../../src/components/Sections/Lessons/DailyLessonItem';
import Filters from '../../src/components/Sections/Lessons/Filters';
import UnitItem from '../../src/components/Sections/Lessons/UnitItem';
import { wrapper } from '../../lib/redux';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { fetchSectionList } from '../../lib/redux/slices/listSlice/thunks';
import FilterLabels from '../../lib/filters/components/FilterLabels';
import { filtersTransformer } from '../../lib/filters';
import { fetchSQData } from '../../lib/redux/slices/sourcesSlice';

const SHOWED_CT = [CT_VIRTUAL_LESSON, CT_WOMEN_LESSON, CT_LECTURE, CT_LESSONS_SERIES];

export const LESSON_AS_COLLECTION = [CT_DAILY_LESSON, ...SHOWED_CT];
export const LESSON_AS_UNIT       = [CT_LESSON_PART, ...SHOWED_CT];
const FILTER_PARAMS               = { content_type: LESSON_AS_UNIT };

export const getServerSideProps = wrapper.getServerSideProps(store => async (context) => {
  const lang      = context.locale ?? 'en';
  const namespace = PAGE_NS_LESSONS;
  await store.dispatch(fetchSQData());

  const filters = filtersTransformer.fromQueryParams(context.query);
  store.dispatch(filterSlice.actions.hydrateNamespace({ namespace, filters }));

  const state   = store.getState();
  const pageNo   = context.query.page_no || 1;
  const pageSize = settings.getPageSize(state.settings);

  await store.dispatch(fetchSectionList({ namespace, pageNo, pageSize, withViews: true, ...FILTER_PARAMS}));
  const _data = lists.getNamespaceState(store.getState().lists, PAGE_NS_LESSONS);
  const _i18n = await serverSideTranslations(lang);
  return { props: { ..._i18n, pageNo, pageSize, filters, ..._data } };
});

const LessonsPage = ({ pageNo, pageSize, filters, items, total }) => {
  const { t } = useTranslation();

  const prevSel = usePrevious(filters);

  const dispatch = useDispatch();
  const setPage  = useCallback(pageNo => dispatch(actions.setPage(PAGE_NS_LESSONS, pageNo)), [dispatch]);

  useEffect(() => {
    if (pageNo !== 1 && !!prevSel && prevSel !== filters) {
      setPage(1);
    }
  }, [pageNo, filters]);

  const filterComponent = <Filters namespace={PAGE_NS_LESSONS} baseParams={FILTER_PARAMS} />;

  return (
    <>
      <SectionHeader section="lessons" />
      <SectionFiltersWithMobile filters={filterComponent} namespace={PAGE_NS_LESSONS}>
        <ResultsPageHeader pageNo={pageNo} total={total} pageSize={pageSize} />
        <FilterLabels namespace={PAGE_NS_LESSONS} />
        {
          items?.filter(({ id }) => !!id)
            .map(({ id, content_type }) => {
              switch (true) {
                case COLLECTION_DAILY_LESSONS.includes(content_type):
                  return <DailyLessonItem id={id} key={id} />;
                case COLLECTION_LESSONS_TYPE.includes(content_type):
                  return <CollectionItem id={id} key={id} />;
                case UNIT_LESSONS_TYPE.includes(content_type):
                  return <UnitItem id={id} key={id} />;
                default:
                  return null;
              }
            })
        }
        <Divider fitted />
        <Container className="padded pagination-wrapper" textAlign="center">
          <Pagination
            pageNo={pageNo}
            pageSize={pageSize}
            total={total}
            onChange={setPage}
          />
        </Container>
      </SectionFiltersWithMobile>
    </>
  );
};
export default LessonsPage;
