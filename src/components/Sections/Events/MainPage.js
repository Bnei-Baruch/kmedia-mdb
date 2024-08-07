import { isEqual } from 'lodash';
import React, { useCallback, useEffect, useMemo } from 'react';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Container, Divider } from 'semantic-ui-react';

import {
  CT_FRIENDS_GATHERING,
  CT_HOLIDAY,
  CT_MEAL,
  EVENT_PAGE_CTS,
  EVENT_TYPES,
  PAGE_NS_EVENTS,
  CT_EVENT_PART
} from '../../../helpers/consts';
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
import CollectionItem from './CollectionItem';
import Filters from './Filters';
import UnitItem from './UnitItem';
import {
  settingsGetContentLanguagesSelector,
  listsGetNamespaceStateSelector,
  filtersGetNotEmptyFiltersSelector,
  settingsGetPageSizeSelector
} from '../../../redux/selectors';

const BASE_PARAMS = { content_type: EVENT_PAGE_CTS };

const MainPage = ({ t }) => {
  const { items, total, wip, err } = useSelector(state => listsGetNamespaceStateSelector(state, PAGE_NS_EVENTS)) || {};
  const contentLanguages           = useSelector(settingsGetContentLanguagesSelector);
  const pageSize                   = useSelector(settingsGetPageSizeSelector);
  const selected                   = useSelector(state => filtersGetNotEmptyFiltersSelector(state, PAGE_NS_EVENTS), isEqual);
  const prevSel                    = usePrevious(selected);

  const location = useLocation();
  const pageNo   = useMemo(() => getPageFromLocation(location) || 1, [location]);

  const dispatch = useDispatch();
  const setPage  = useCallback(pageNo => dispatch(actions.setPage(PAGE_NS_EVENTS, pageNo)), [dispatch]);

  useEffect(() => {
    dispatch(prepareActions.fetchCollections(PAGE_NS_EVENTS, { content_type: CT_HOLIDAY }));
  }, [contentLanguages, dispatch]);

  useEffect(() => {
    if (pageNo !== 1 && !!prevSel && prevSel !== selected) {
      setPage(1);
    } else {
      dispatch(actions.fetchSectionList(PAGE_NS_EVENTS, pageNo, { pageSize, content_type: EVENT_PAGE_CTS }));
    }

  }, [contentLanguages, dispatch, pageNo, selected]);

  const wipErr = WipErr({ wip, err, t });
  return (<>
    <SectionHeader section="events"/>
    <SectionFiltersWithMobile
      namespace={PAGE_NS_EVENTS}
      filters={
        <Filters
          namespace={PAGE_NS_EVENTS}
          baseParams={BASE_PARAMS}
        />
      }
    >
      <ResultsPageHeader pageNo={pageNo} total={total} pageSize={pageSize}/>
      <FilterLabels namespace={PAGE_NS_EVENTS}/>
      {
        wipErr || items?.map(
          ({ id, content_type }, i) => {
            switch (true) {
              case EVENT_TYPES.includes(content_type):
                return <CollectionItem id={id} key={i}/>;
              case [CT_MEAL, CT_FRIENDS_GATHERING, CT_EVENT_PART].includes(content_type):
                return <UnitItem id={id} key={i}/>;
              default:
                return null;
            }
          }
        )
      }
      <Divider fitted/>
      <Container className="padded pagination-wrapper" textAlign="center">
        {
          total > 0 && <Pagination
            pageNo={pageNo}
            pageSize={pageSize}
            total={total}
            onChange={setPage}
          />
        }
      </Container>
    </SectionFiltersWithMobile>
  </>);
};

export default withTranslation()(MainPage);
