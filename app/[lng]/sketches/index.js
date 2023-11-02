import React from 'react';
import { Container, Divider, CardGroup } from 'semantic-ui-react';

import {
  MT_IMAGE,
  PAGE_NS_SKETCHES,
  UNIT_LESSONS_TYPE,
  CT_VIDEO_PROGRAM_CHAPTER,
  DEFAULT_CONTENT_LANGUAGE
} from '../../../src/helpers/consts';
import { filterSlice } from '../../../lib/redux/slices/filterSlice/filterSlice';
import { selectors as lists } from '../../../lib/redux/slices/listSlice/listSlice';
import { selectors as settings } from '../../../lib/redux/slices/settingsSlice/settingsSlice';

import FilterLabels from '../../../lib/filters/components/FilterLabels';
import Pagination from '../../../src/components/Pagination/Pagination';
import ResultsPageHeader from '../../../src/components/Pagination/ResultsPageHeader';
import SectionFiltersWithMobile from '../../../src/components/shared/SectionFiltersWithMobile';
import SectionHeader from '../../../src/components/shared/SectionHeader';
import Filters from '../../../src/components/Sections/Sketches/Filters';
import UnitItem from '../../../src/components/Sections/Sketches/UnitItem';
import MediaHelper from '../../../src/helpers/media';
import { isZipFile } from '../../../src/components/Pages/WithPlayer/widgets/UnitMaterials/helper';
import { wrapper } from '../../../lib/redux';
import { filtersTransformer } from '../../../lib/filters';
import { fetchSectionList } from '../../../lib/redux/slices/listSlice/thunks';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { unzipList } from '../../../lib/redux/slices/assetSlice';

export const SKETCHES_SHOWED_CTS = [...UNIT_LESSONS_TYPE, CT_VIDEO_PROGRAM_CHAPTER];
const FILTER_PARAMS              = {
  content_type: SKETCHES_SHOWED_CTS,
  media_type: MT_IMAGE,
  withViews: false,
  with_files: true,
};

export const getServerSideProps = wrapper.getServerSideProps(store => async (context) => {
  const lang      = context.locale ?? DEFAULT_CONTENT_LANGUAGE;
  const namespace = PAGE_NS_SKETCHES;

  const filters = filtersTransformer.fromQueryParams(context.query);
  store.dispatch(filterSlice.actions.hydrateNamespace({ namespace, filters }));

  const state    = store.getState();
  const pageNo   = context.query.page_no || 1;
  const pageSize = settings.getPageSize(state.settings);

  await store.dispatch(fetchSectionList({
    namespace,
    pageNo,
    pageSize,
    with_files: true,
    ...FILTER_PARAMS
  }));
  const _data = lists.getNamespaceState(store.getState().lists, namespace);

  const zipIdsForFetch = _data.items?.map(x => x.files).flat()
    .filter(x => MediaHelper.IsImage(x) && isZipFile(x))
    .map(x => x.id);
  await store.dispatch(unzipList(zipIdsForFetch));

  const _i18n = await serverSideTranslations(lang);
  return { props: { ..._i18n, pageSize, namespace, ..._data } };
});

const SketchesPage = ({ pageSize, items, total }) => {
  const namespace = PAGE_NS_SKETCHES;

  return (<>
    <SectionHeader section="sketches" />
    <SectionFiltersWithMobile
      namespace={namespace}
      filters={
        <Filters
          namespace={namespace}
          baseParams={FILTER_PARAMS}
        />
      }
    >
      <ResultsPageHeader total={total} pageSize={pageSize} />
      <FilterLabels namespace={namespace} />
      <CardGroup itemsPerRow={4} doubling stackable>
        {
          items?.map(({ id }) => <UnitItem id={id} key={id} />)
        }
      </CardGroup>

      <Divider fitted />
      <Container className="padded pagination-wrapper" textAlign="center">
        <Pagination pageSize={pageSize} total={total} />
      </Container>
    </SectionFiltersWithMobile>
  </>);
};

export default SketchesPage;
