import { isEqual } from 'lodash';
import React, { useCallback, useEffect, useMemo } from 'react';
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

const BlogContainer = ({ namespace }) => {
  const items    = useSelector(state => selectors.getBlogPosts(state.publications));
  const total    = useSelector(state => selectors.getBlogTotal(state.publications));
  const wip      = useSelector(state => selectors.getBlogWip(state.publications));
  const err      = useSelector(state => selectors.getBlogError(state.publications));
  const pageSize = useSelector(settingsGetPageSizeSelector);

  const contentLanguages = useSelector(settingsGetContentLanguagesSelector);
  const selected         = useSelector(state => filtersGetNotEmptyFiltersSelector(state, namespace), isEqual);
  const prevSel          = usePrevious(selected);

  const dispatch = useDispatch();
  const setPage  = useCallback(n => dispatch(actions.setPage(namespace, n)), [dispatch, namespace]);

  const location = useLocation();
  const pageNo   = useMemo(() => getPageFromLocation(location) || 1, [location]);

  const blogs = useMemo(() => {
    const b = contentLanguages.map(lang => {
      switch (lang) {
        case LANG_HEBREW:
          return 'laitman-co-il';
        case LANG_UKRAINIAN:
        case LANG_RUSSIAN:
          return 'laitman-ru';
        case LANG_SPANISH:
          return 'laitman-es';
        case LANG_ENGLISH:
          return 'laitman-com';
        default:
          return null;
      }
    }).filter(Boolean);
    if (!b.length) b.push('laitman-com');
    return b;
  }, [contentLanguages]);

  useEffect(() => {
    if (pageNo !== 1 && !!prevSel && prevSel !== selected) {
      setPage(1);
    } else {
      dispatch(actions.fetchBlogList(namespace, pageNo, { blog: blogs, pageSize }));
    }
  }, [contentLanguages, dispatch, pageNo, selected, pageSize, blogs, namespace, prevSel, setPage]);

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

export default BlogContainer;
