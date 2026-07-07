import isEqual from 'lodash/isEqual';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { LANG_ENGLISH, LANG_HEBREW, LANG_RUSSIAN, LANG_SPANISH, LANG_UKRAINIAN } from '../../../../../helpers/consts';
import { usePrevious } from '../../../../../helpers/utils';
import { actions, selectors } from '../../../../../redux/modules/publications';
import { getPageFromLocation } from '../../../../Pagination/withPagination';
import SectionFiltersWithMobile from '../../../../shared/SectionFiltersWithMobile';
import {
  filtersGetNotEmptyFiltersSelector,
  settingsGetContentLanguagesSelector,
  settingsGetPageSizeSelector,
} from '../../../../../redux/selectors';
import Filters from '../../Filters';
import Page from './Page';

const TwitterContainer = ({ namespace }) => {
  const items    = useSelector(state => selectors.getTweets(state.publications));
  const total    = useSelector(state => selectors.getTweetsTotal(state.publications));
  const wip      = useSelector(state => selectors.getTweetsWip(state.publications));
  const err      = useSelector(state => selectors.getTweetsError(state.publications));
  const pageSize = useSelector(settingsGetPageSizeSelector);

  const contentLanguages = useSelector(settingsGetContentLanguagesSelector);
  const selected         = useSelector(state => filtersGetNotEmptyFiltersSelector(state, namespace), isEqual);
  const prevSel          = usePrevious(selected);

  const dispatch = useDispatch();
  const setPage  = useCallback(n => dispatch(actions.setPage(namespace, n)), [dispatch, namespace]);

  const location = useLocation();
  const pageNo   = useMemo(() => getPageFromLocation(location) || 1, [location]);

  const usernames = useMemo(() => {
    const u = contentLanguages.map(lang => {
      switch (lang) {
        case LANG_HEBREW:
          return 'laitman_co_il';
        case LANG_UKRAINIAN:
        case LANG_RUSSIAN:
          return 'Michael_Laitman';
        case LANG_SPANISH:
          return 'laitman_es';
        case LANG_ENGLISH:
          return 'laitman';
        default:
          return null;
      }
    }).filter(Boolean);
    if (!u.length) u.push('laitman');
    return u;
  }, [contentLanguages]);

  useEffect(() => {
    if (pageNo !== 1 && !!prevSel && prevSel !== selected) {
      setPage(1);
    } else {
      dispatch(actions.fetchTweets(namespace, pageNo, { username: usernames, pageSize }));
    }
  }, [contentLanguages, dispatch, pageNo, selected, pageSize, usernames, namespace, prevSel, setPage]);

  return (
    <SectionFiltersWithMobile namespace={namespace} filters={<Filters namespace={namespace} />}>
      <Page
        namespace={namespace}
        items={items}
        wip={wip}
        err={err}
        pageNo={pageNo}
        total={total}
        pageSize={pageSize}
        onPageChange={setPage}
      />
    </SectionFiltersWithMobile>
  );
};

export default TwitterContainer;
