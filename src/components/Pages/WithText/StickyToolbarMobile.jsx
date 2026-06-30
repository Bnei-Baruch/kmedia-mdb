import { clsx } from 'clsx';
import { useSelector } from 'react-redux';

import SearchOnPageBar from './SearchOnPageBar';
import {
  textPageGetScrollDirSelector,
  textPageGetIsSearchSelector,
  settingsGetUILangSelector
} from '../../../redux/selectors';
import { LANGUAGE_LONG_TRANSLATION } from '../../../helpers/consts';

const scrollClasses = scrollDir => ({
  'stick_toolbar_unpinned': scrollDir === 1,
  'stick_toolbar_pinned': scrollDir === -1,
  'stick_toolbar_on_end': scrollDir === 2,
});

const StickyToolbarMobile = ({ toolbar, playerPage, slot }) => {
  const scrollDir = useSelector(textPageGetScrollDirSelector);
  const isSearch  = useSelector(textPageGetIsSearchSelector);
  const uiLang    = useSelector(settingsGetUILangSelector);
  const isLongTranslation = LANGUAGE_LONG_TRANSLATION.includes(uiLang);

  if (isSearch) {
    if (slot !== 'bottom') return null;
    return (
      <div className="stick_toolbar no_print stick_toolbar_fixed stick_bottom">
        <SearchOnPageBar />
      </div>
    );
  }

  const showHere = playerPage ? slot === 'top' : slot === 'bottom';
  if (!showHere) return null;

  return (
    <div className={
      clsx('stick_toolbar no_print', scrollClasses(scrollDir), {
        'stick_bottom': !playerPage,
        'stick_toolbar_long_translation': isLongTranslation,
      })
    }>
      {toolbar}
    </div>
  );
};

export const StickyBreadcrumbMobile = ({ breadcrumb }) => {
  const scrollDir = useSelector(textPageGetScrollDirSelector);

  return (
    <div className={clsx('stick_toolbar no_print', scrollClasses(scrollDir))}>
      {breadcrumb}
    </div>
  );
};

export default StickyToolbarMobile;
