import { clsx } from 'clsx';
import { useSelector } from 'react-redux';

import SearchOnPageBar from './SearchOnPageBar';
import {
  textPageGetUrlInfoSelector,
  textPageGetScrollDirSelector,
  textPageGetIsSearchSelector
} from '../../../redux/selectors';

const StickyToolbar = ({ breadcrumb, toolbar }) => {
  const scrollDir = useSelector(textPageGetScrollDirSelector);
  const hasSel    = useSelector(state => !!textPageGetUrlInfoSelector(state).select);
  const isSearch  = useSelector(textPageGetIsSearchSelector);

  if (isSearch) {
    return (
      <div className={
        clsx('stick_toolbar no_print stick_toolbar_fixed', {
          'stick_toolbar_unpinned': scrollDir !== -1,
          'stick_toolbar_pinned': scrollDir === -1
        })}>
        <SearchOnPageBar />
      </div>
    );
  }

  return (
    <div className={
      clsx('stick_toolbar no_print', {
        'stick_toolbar_unpinned': scrollDir === 1 || scrollDir === 2,
        'stick_toolbar_pinned': scrollDir === -1,
        'stick_toolbar_fixed': hasSel,
        'text_selected': hasSel
      })
    }>
      {breadcrumb}
      {toolbar}
    </div>
  );
};

export default StickyToolbar;
