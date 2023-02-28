import { isEqual } from 'lodash';
import React, { useCallback, useEffect, useMemo } from 'react';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { Container, Divider, CardGroup } from 'semantic-ui-react';

import { MT_IMAGE, PAGE_NS_SKETCHES, UNIT_LESSONS_TYPE, CT_VIDEO_PROGRAM_CHAPTER } from '../../../helpers/consts';
import { usePrevious, isEmpty } from '../../../helpers/utils';
import { selectors as filters } from '../../../redux/modules/filters';
import { actions, selectors as lists } from '../../../redux/modules/lists';
import { actions as assetsActions, selectors as assets } from '../../../redux/modules/assets';
import { selectors as settings } from '../../../redux/modules/settings';

import FilterLabels from '../../FiltersAside/FilterLabels';
import Pagination from '../../Pagination/Pagination';
import ResultsPageHeader from '../../Pagination/ResultsPageHeader';
import { getPageFromLocation } from '../../Pagination/withPagination';
import SectionFiltersWithMobile from '../../shared/SectionFiltersWithMobile';
import SectionHeader from '../../shared/SectionHeader';
import Filters from './Filters';
import UnitItem from './UnitItem';
import MediaHelper from '../../../helpers/media';
import { isZipFile } from '../../Pages/WithPlayer/widgets/UnitMaterials/helper';

export const SKETCHES_SHOWED_CTS = [...UNIT_LESSONS_TYPE, CT_VIDEO_PROGRAM_CHAPTER];
const FILTER_PARAMS              = {
  content_type: SKETCHES_SHOWED_CTS,
  media_type: MT_IMAGE,
  withViews: false,
  with_files: true,
};

const MainPage = ({ t }) => {
  const { items: cus, total } = useSelector(state => lists.getNamespaceState(state.lists, PAGE_NS_SKETCHES)) || {};
  const language              = useSelector(state => settings.getLanguage(state.settings));
  const pageSize              = useSelector(state => settings.getPageSize(state.settings));
  const selected              = useSelector(state => filters.getNotEmptyFilters(state.filters, PAGE_NS_SKETCHES), isEqual);
  const getZipById            = useSelector(state => assets.nestedGetZipById(state.assets));

  const prevSel = usePrevious(selected);

  const dispatch = useDispatch();
  const setPage  = useCallback(pageNo => dispatch(actions.setPage(PAGE_NS_SKETCHES, pageNo)), [dispatch]);

  const location = useLocation();
  const pageNo   = useMemo(() => getPageFromLocation(location) || 1, [location]);

  let wipAll;
  const zipIdsForFetch = cus?.map(x => x.files).flat()
    .filter(x => MediaHelper.IsImage(x) && isZipFile(x))
    .map(x => x.id)
    .filter(id => {
      const x             = getZipById(id) || false;
      const { wip, data } = x;
      if (wip) wipAll = true;
      return !wip && isEmpty(data);
    });

  useEffect(() => {
    if (pageNo !== 1 && !!prevSel && prevSel !== selected) {
      setPage(1);
    } else {
      dispatch(actions.fetchSectionList(PAGE_NS_SKETCHES, pageNo, { pageSize, ...FILTER_PARAMS }));
    }
  }, [language, dispatch, pageNo, selected, pageSize, prevSel, setPage]);

  useEffect(() => {
    if (!wipAll && zipIdsForFetch?.length > 0) {
      dispatch(assetsActions.unzipList(zipIdsForFetch));
    }
  }, [dispatch, zipIdsForFetch, wipAll]);

  return (<>
    <SectionHeader section="sketches" />
    <SectionFiltersWithMobile
      filters={
        <Filters
          namespace={PAGE_NS_SKETCHES}
          baseParams={FILTER_PARAMS}
        />
      }
    >
      <ResultsPageHeader pageNo={pageNo} total={total} pageSize={pageSize} />
      <FilterLabels namespace={PAGE_NS_SKETCHES} />
      <CardGroup itemsPerRow={4} doubling stackable>
        {
          cus?.map(({ id }, i) => <UnitItem id={id} key={i} />)
        }
      </CardGroup>

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
