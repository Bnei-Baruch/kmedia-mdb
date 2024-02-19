import React, { useMemo, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { DOM_ROOT_ID, prepareScrollToSearch } from '../scrollToSearch/helper';
import { getQuery } from '../../../../helpers/url';
import { getLanguageDirection } from '../../../../helpers/i18n-utils';
import { useTextContent } from './useTextContent';
import { textPageGetFileSelector, assetsGetDoc2htmlByIdSelector } from '../../../../redux/selectors';
import { useNotes } from '../Notes/useNotes';
import { SCROLL_SEARCH_ID } from '../../../../helpers/consts';

const ContentHtml = ({ labels = [] }) => {
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
  }, [srchstart, srchend, getDoc2htmlById, id, labels, notes]);

  const _needScroll = !!__html && !!srchstart && !!srchend;
  useEffect(() => {
    const el = document.getElementById(SCROLL_SEARCH_ID);
    el && el.scrollIntoView({ behavior: 'smooth' });
  }, [_needScroll, ref.current]);

  const wipErr = useTextContent();

  if (wipErr) return wipErr;

  const dir = getLanguageDirection(language);

  return (
    <div className={`${language}_styles`} dir={dir}>
      <div id={DOM_ROOT_ID} dangerouslySetInnerHTML={{ __html }} ref={ref} />
    </div>
  );
};

export default ContentHtml;
