import { useMemo, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { DOM_ROOT_ID, prepareScrollToSearch } from '../scrollToSearch/helper';
import { getQuery } from '../../../../helpers/url';
import { getLanguageDirection } from '../../../../helpers/i18n-utils';
import { useTextContent } from './useTextContent';
import { textPageGetFileSelector, assetsGetDoc2htmlByIdSelector } from '../../../../redux/selectors';
import { useNotes } from '../Notes/useNotes';
import { SCROLL_SEARCH_ID } from '../../../../helpers/consts';

const EMPTY_LABELS = [];

const ContentHtml = ({ labels = EMPTY_LABELS }) => {
  const ref = useRef();

  const { language, id } = useSelector(textPageGetFileSelector);
  const getDoc2htmlById  = useSelector(assetsGetDoc2htmlByIdSelector);

  const location = useLocation();
  const notes    = useNotes();

  const { srchstart, srchend, highlightAll } = getQuery(location);

  const __html = useMemo(() => {
    const data = getDoc2htmlById[id]?.data;
    if (!data) return null;
    return prepareScrollToSearch(data,
      { srchstart, srchend },
      highlightAll === 'true',
      [...labels, ...notes]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [srchstart, srchend, getDoc2htmlById, id, labels, notes]);

  const _needScroll = !!__html && !!srchstart && !!srchend;
  useEffect(() => {
    // center: at the top the quote would be under the sticky text toolbar
    const scroll = () => document.getElementById(SCROLL_SEARCH_ID)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    scroll();
    // once more when the page has settled (player, images): on a fresh load the text still moves down
    const timer = setTimeout(scroll, 1200);
    return () => clearTimeout(timer);
  }, [_needScroll, srchstart, srchend, id]);

  const wipErr = useTextContent();

  if (wipErr) return wipErr;

  const dir = getLanguageDirection(language);

  // <article> marks the main text for browser reader mode (Readability) and crawlers.
  return (
    <article className={`${language}_styles`} dir={dir} lang={language}>
      <div id={DOM_ROOT_ID} dangerouslySetInnerHTML={{ __html }} ref={ref} />
    </article>
  );
};

export default ContentHtml;
