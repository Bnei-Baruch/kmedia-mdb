import { isEqual } from 'lodash';
import React, { useCallback, useEffect, useMemo } from 'react';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { Container, Divider } from 'semantic-ui-react';

import { PAGE_NS_PROGRAMS } from '../../../helpers/consts';
import { usePrevious } from '../../../helpers/utils';
import { actions } from '../../../redux/modules/lists';

import FilterLabels from '../../FiltersAside/FilterLabels';
import PageHeader from '../../Pages/Collection/Header';
import Pagination from '../../Pagination/Pagination';
import ResultsPageHeader from '../../Pagination/ResultsPageHeader';
import { getPageFromLocation } from '../../Pagination/withPagination';
import SectionFiltersWithMobile from '../../shared/SectionFiltersWithMobile';
import WipErr from '../../shared/WipErr/WipErr';
import Filters from './Filters';
import ItemOfList from './ItemOfList';
import {
  settingsGetContentLanguagesSelector,
  mdbGetDenormCollectionSelector,
  listsGetNamespaceStateSelector,
  filtersGetNotEmptyFiltersSelector,
  settingsGetPageSizeSelector
} from '../../../redux/selectors';

const ProgramPage = ({ t }) => {
  const { id: cid } = useParams();
  const namespace   = `${PAGE_NS_PROGRAMS}_${cid}`;

  const collection = useSelector(state => mdbGetDenormCollectionSelector(state, cid));

  const { items, total, wip, err } = useSelector(state => listsGetNamespaceStateSelector(state, namespace)) || {};
  const contentLanguages           = useSelector(settingsGetContentLanguagesSelector);
  const pageSize                   = useSelector(settingsGetPageSizeSelector);
  const selected                   = useSelector(state => filtersGetNotEmptyFiltersSelector(state, namespace), isEqual);

  const dispatch   = useDispatch();
  const location   = useLocation();
  const prevSel    = usePrevious(selected);
  const setPage    = useCallback(pageNo => dispatch(actions.setPage(namespace, pageNo)), [namespace, dispatch]);
  const pageNo     = useMemo(() => getPageFromLocation(location) || 1, [location]);
  const baseParams = useMemo(() => ({ collection: [cid] }), [cid]);

  useEffect(() => {
    if (pageNo !== 1 && !!prevSel && prevSel !== selected) {
      setPage(1);
    } else {
      dispatch(actions.fetchList(namespace, pageNo, { collection: cid, pageSize, withViews: true }));
    }
  }, [contentLanguages, pageNo, selected]);

  const wipErr = WipErr({ wip, err, t });

  return (<>
    <PageHeader collection={collection} namespace={namespace} title="programs-collection"/>
    <SectionFiltersWithMobile
      namespace={namespace}
      filters={
        <Filters
          namespace={namespace}
          baseParams={baseParams}
        />
      }
    >
      <ResultsPageHeader pageNo={pageNo} total={total} pageSize={pageSize}/>
      <FilterLabels namespace={namespace}/>
      {
        wipErr || items?.map(id => <ItemOfList id={id} ccu={collection} key={id}/>)
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
  </>);
};

export default withTranslation()(ProgramPage);
