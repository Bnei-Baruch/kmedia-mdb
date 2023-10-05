import { isEqual } from 'lodash';
import React, { useCallback, useEffect, useMemo } from 'react';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { Container, Divider } from 'semantic-ui-react';

import { PAGE_NS_LESSONS } from '../../../helpers/consts';
import { usePrevious } from '../../../helpers/utils';
import { selectors as filters } from '../../../redux/modules/filters';
import { actions, selectors as lists } from '../../../redux/modules/lists';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { selectors as settings } from '../../../redux/modules/settings';
import FilterLabels from '../../FiltersAside/FilterLabels';
import PageHeader from '../../Pages/Collection/Header';
import Pagination from '../../Pagination/Pagination';
import ResultsPageHeader from '../../Pagination/ResultsPageHeader';
import { getPageFromLocation } from '../../Pagination/withPagination';
import SectionFiltersWithMobile from '../../shared/SectionFiltersWithMobile';
import WipErr from '../../shared/WipErr/WipErr';
import Filters from './Filters';
import ItemOfList from './ItemOfList';

const LessonPage = ({ t }) => {
  const { id: cid } = useParams();

  const namespace = `${PAGE_NS_LESSONS}_${cid}`;

  const collection = useSelector(state => mdb.getDenormCollection(state.mdb, cid));

  const { items, total, wip, err } = useSelector(state => lists.getNamespaceState(state.lists, namespace)) || {};
  const contentLanguages           = useSelector(state => settings.getContentLanguages(state.settings));
  const pageSize                   = useSelector(state => settings.getPageSize(state.settings));
  const selected                   = useSelector(state => filters.getNotEmptyFilters(state.filters, namespace), isEqual);
  const prevSel                    = usePrevious(selected);

  const dispatch = useDispatch();
  const setPage  = useCallback(pageNo => dispatch(actions.setPage(namespace, pageNo)), [namespace, dispatch]);

  const location   = useLocation();
  const pageNo     = useMemo(() => getPageFromLocation(location) || 1, [location]);
  const baseParams = useMemo(() => ({ collection: [cid] }), [cid]);

  useEffect(() => {
    if (pageNo !== 1 && !!prevSel && prevSel !== selected) {
      setPage(1);
    } else {
      dispatch(actions.fetchList(namespace, pageNo, { collection: cid, pageSize, withViews: true }));
    }
  }, [contentLanguages, pageNo, selected, cid]);

  const wipErr = WipErr({ wip, err, t });

  return (<>
    <PageHeader collection={collection} namespace={namespace} title="lessons-collection" />

    <SectionFiltersWithMobile
      namespace={namespace}
      filters={
        <Filters
          namespace={namespace}
          baseParams={baseParams}
        />
      }
    >

      <ResultsPageHeader pageNo={pageNo} total={total} pageSize={pageSize} />
      <FilterLabels namespace={namespace} />
      {
        wipErr || items?.map((id, i) => <ItemOfList id={id} ccu={collection} key={i} />)
      }
      <Divider fitted />
      <Container className="padded pagination-wrapper" textAlign="center">
        {total > 0 && <Pagination
          pageNo={pageNo}
          pageSize={pageSize}
          total={total}
          onChange={setPage}
        />}
      </Container>
    </SectionFiltersWithMobile>
  </>);
};

export default withTranslation()(LessonPage);
