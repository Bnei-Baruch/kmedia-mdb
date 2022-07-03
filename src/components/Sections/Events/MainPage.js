import { isEqual } from 'lodash';
import React, { useCallback, useEffect, useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
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
} from '../../../helpers/consts';
import { usePrevious } from '../../../helpers/utils';
import { selectors as filters } from '../../../redux/modules/filters';
import { actions, selectors as lists } from '../../../redux/modules/lists';
import { actions as prepareActions } from '../../../redux/modules/preparePage';
import { selectors as settings } from '../../../redux/modules/settings';
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

const BASE_PARAMS = { content_type: EVENT_PAGE_CTS };

const MainPage = ({ t }) => {
  const { items, total, wip, err } = useSelector(state => lists.getNamespaceState(state.lists, PAGE_NS_EVENTS)) || {};
  const language                   = useSelector(state => settings.getLanguage(state.settings));
  const pageSize                   = useSelector(state => settings.getPageSize(state.settings));
  const selected                   = useSelector(state => filters.getFilters(state.filters, PAGE_NS_EVENTS), isEqual);
  const prevSel                    = usePrevious(selected);

  const location = useLocation();
  const pageNo   = useMemo(() => getPageFromLocation(location) || 1, [location]);

  const dispatch = useDispatch();
  const setPage  = useCallback(pageNo => dispatch(actions.setPage(PAGE_NS_EVENTS, pageNo)), [dispatch]);

  useEffect(() => {
    dispatch(prepareActions.fetchCollections(PAGE_NS_EVENTS, { content_type: CT_HOLIDAY }));
  }, [language, dispatch]);

  useEffect(() => {
    if (pageNo !== 1 && !!prevSel && prevSel !== selected) {
      setPage(1);
    } else {
      dispatch(actions.fetchSectionList(PAGE_NS_EVENTS, pageNo, { pageSize, content_type: EVENT_PAGE_CTS }));
    }

  }, [language, dispatch, pageNo, selected]);

  const wipErr = WipErr({ wip, err, t });
  return (<>
    <SectionHeader section="events" />
    <SectionFiltersWithMobile
      filters={
        <Filters
          namespace={PAGE_NS_EVENTS}
          baseParams={BASE_PARAMS}
        />
      }
    >
      <ResultsPageHeader pageNo={pageNo} total={total} pageSize={pageSize} />
      <FilterLabels namespace={PAGE_NS_EVENTS} />
      {
        wipErr || items?.map(({ id, content_type }, i) => {
            switch (true) {
            case EVENT_TYPES.includes(content_type):
              return <CollectionItem id={id} key={i} />;
            case [CT_MEAL, CT_FRIENDS_GATHERING].includes(content_type):
              return <UnitItem id={id} key={i} />;
            default:
              return null;
            }
          }
        )
      }
      <Divider fitted />
      <Container className="padded pagination-wrapper" textAlign="center">
        {
          total > 0 && <Pagination
            pageNo={pageNo}
            pageSize={pageSize}
            total={total}
            language={language}
            onChange={setPage}
          />
        }
      </Container>
    </SectionFiltersWithMobile>
  </>);
};

export default withNamespaces()(MainPage);
