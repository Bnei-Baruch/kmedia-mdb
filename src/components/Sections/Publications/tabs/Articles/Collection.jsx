import isEqual from 'lodash/isEqual';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';

import { CT_ARTICLE } from '../../../../../helpers/consts';
import { usePrevious } from '../../../../../helpers/utils';
import { actions } from '../../../../../redux/modules/lists';
import { actions as mdbActions } from '../../../../../redux/modules/mdb';
import CollectionHeader from '../../../../Pages/Collection/Header';
import FilterLabels from '../../../../FiltersAside/FilterLabels';
import Pagination from '../../../../Pagination/Pagination';
import ResultsPageHeader from '../../../../Pagination/ResultsPageHeader';
import { getPageFromLocation } from '../../../../Pagination/withPagination';
import SectionFiltersWithMobile from '../../../../shared/SectionFiltersWithMobile';
import { getWipErr } from '../../../../shared/WipErr/WipErr';
import TextListTemplate from '../../../../shared/ContentItem/TextListTemplate';
import {
  filtersGetNotEmptyFiltersSelector,
  listsGetNamespaceStateSelector,
  mdbGetCollectionByIdSelector,
  mdbGetWipFn,
  settingsGetContentLanguagesSelector,
  settingsGetPageSizeSelector,
} from '../../../../../redux/selectors';
import Filters from './CollectionFilters';

const NAMESPACE = 'publications-collection';

const PublicationCollection = () => {
  const { id } = useParams();

  const [collection]               = useSelector(state => mdbGetCollectionByIdSelector(state, [id]));
  const { items, total, wip, err } = useSelector(state => listsGetNamespaceStateSelector(state, NAMESPACE)) || {};
  const mdbWip                     = useSelector(mdbGetWipFn);
  const contentLanguages           = useSelector(settingsGetContentLanguagesSelector);
  const pageSize                   = useSelector(settingsGetPageSizeSelector);
  const selected                   = useSelector(state => filtersGetNotEmptyFiltersSelector(state, NAMESPACE), isEqual);
  const prevSel                    = usePrevious(selected);

  const dispatch = useDispatch();
  const setPage  = useCallback(pageNo => dispatch(actions.setPage(NAMESPACE, pageNo)), [dispatch]);

  const location     = useLocation();
  const pageNo       = useMemo(() => getPageFromLocation(location) || 1, [location]);
  const filterParams = useMemo(() => ({ content_type: CT_ARTICLE, collection: id }), [id]);

  useEffect(() => {
    if (!Object.prototype.hasOwnProperty.call(mdbWip.collections, id)) {
      dispatch(mdbActions.fetchCollection(id));
    }
  }, [id, mdbWip, dispatch]);

  useEffect(() => {
    if (pageNo !== 1 && !!prevSel && prevSel !== selected) {
      setPage(1);
    } else {
      dispatch(actions.fetchList(NAMESPACE, pageNo, { pageSize, ...filterParams }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentLanguages, dispatch, pageNo, selected, filterParams]);

  const wipErr = getWipErr(wip, err);

  return (
    <SectionFiltersWithMobile
      namespace={NAMESPACE}
      filters={<Filters namespace={NAMESPACE} />}
    >
      <CollectionHeader collection={collection} namespace={NAMESPACE} />
      <ResultsPageHeader pageNo={pageNo} total={total} pageSize={pageSize} />
      <FilterLabels namespace={NAMESPACE} />
      {wipErr || items?.map(cuID => <TextListTemplate cuID={cuID} key={cuID} />)}
      <hr className="m-0 border-t" />
      {total > 0 && (
        <Pagination
          pageNo={pageNo}
          pageSize={pageSize}
          total={total}
          onChange={setPage}
        />
      )}
    </SectionFiltersWithMobile>
  );
};

export default PublicationCollection;
