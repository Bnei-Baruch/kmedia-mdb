import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { DOM_ROOT_ID, prepareScrollToSearch } from '../scrollToSearch/helper';
import { getQuery } from '../../../../helpers/url';
import { getLanguageDirection } from '../../../../helpers/i18n-utils';
import { useTextContent } from './useTextContent';
import { textPageGetFileSelector, assetsGetDoc2htmlByIdSelector } from '../../../../redux/selectors';
import { useNotes } from '../Notes/useNotes';

const ContentHtml = ({ labels = [] }) => {
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

  const wipErr = useTextContent();

  if (wipErr) return wipErr;

  const dir = getLanguageDirection(language);

  return (
    <div className={`${language}_styles`} dir={dir}>
      <div id={DOM_ROOT_ID} dangerouslySetInnerHTML={{ __html }} />
    </div>
  );
};

export default ContentHtml;
