import { isEqual } from 'lodash';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Container, Divider } from 'semantic-ui-react';
import { COLLECTION_PROGRAMS_TYPE, PAGE_NS_PROGRAMS, UNIT_PROGRAMS_TYPE } from '../../../helpers/consts';
import { usePrevious } from '../../../helpers/utils';
import { actions } from '../../../redux/modules/lists';

import { actions as prepareActions } from '../../../redux/modules/preparePage';
import FilterLabels from '../../FiltersAside/FilterLabels';
import Pagination from '../../Pagination/Pagination';
import ResultsPageHeader from '../../Pagination/ResultsPageHeader';
import { getPageFromLocation } from '../../Pagination/withPagination';
import SectionFiltersWithMobile from '../../shared/SectionFiltersWithMobile';
import SectionHeader from '../../shared/SectionHeader';
import WipErr from '../../shared/WipErr/WipErr';
import Filters from './Filters';
import ItemOfList from './ItemOfList';
import {
  settingsGetContentLanguagesSelector,
  listsGetNamespaceStateSelector,
  filtersGetNotEmptyFiltersSelector,
  settingsGetPageSizeSelector
} from '../../../redux/selectors';

const FILTER_PARAMS = { content_type: [...COLLECTION_PROGRAMS_TYPE, ...UNIT_PROGRAMS_TYPE] };

const MainPage = () => {
  const { items, total, wip, err } = useSelector(state => listsGetNamespaceStateSelector(state, PAGE_NS_PROGRAMS)) || {};
  const contentLanguages           = useSelector(settingsGetContentLanguagesSelector);
  const pageSize                   = useSelector(settingsGetPageSizeSelector);
  const selected                   = useSelector(state => filtersGetNotEmptyFiltersSelector(state, PAGE_NS_PROGRAMS), isEqual);

  const { t }   = useTranslation();
  const prevSel = usePrevious(selected);

  const dispatch = useDispatch();
  const setPage  = useCallback(pageNo => dispatch(actions.setPage(PAGE_NS_PROGRAMS, pageNo)), [dispatch]);

  const location = useLocation();
  const pageNo   = useMemo(() => getPageFromLocation(location) || 1, [location]);

  useEffect(() => {
    dispatch(prepareActions.fetchCollections(PAGE_NS_PROGRAMS, { content_type: COLLECTION_PROGRAMS_TYPE }));
  }, [contentLanguages, dispatch]);

  useEffect(() => {
    if (pageNo !== 1 && !!prevSel && prevSel !== selected) {
      setPage(1);
    } else {
      dispatch(actions.fetchList(PAGE_NS_PROGRAMS, pageNo, {
        content_type: UNIT_PROGRAMS_TYPE,
        pageSize,
        withViews   : true
      }));
    }
  }, [contentLanguages, dispatch, pageNo, selected]);

  const wipErr          = WipErr({ wip, err, t });
  const filterComponent = <Filters namespace={PAGE_NS_PROGRAMS} baseParams={FILTER_PARAMS}/>;

  return (
    <>
      <SectionHeader section="programs"/>
      <SectionFiltersWithMobile namespace={PAGE_NS_PROGRAMS} filters={filterComponent}>
        <ResultsPageHeader pageNo={pageNo} total={total} pageSize={pageSize}/>
        <FilterLabels namespace={PAGE_NS_PROGRAMS}/>
        {
          wipErr || items?.map((id, i) => <ItemOfList id={id} key={i}/>)
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

export default MainPage;
