import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { DOM_ROOT_ID, prepareScrollToSearch } from '../scrollToSearch/helper';
import { getQuery } from '../../../../helpers/url';
import { useSelector } from 'react-redux';
import { selectors as assets } from '../../../../redux/modules/assets';
import { getLanguageDirection } from '../../../../helpers/i18n-utils';
import { useTextContent } from './useTextContent';
import { textPageGetFileSelector } from '../../../../redux/selectors';

const ContentHtml = ({ labels = [], notes = [] }) => {
  const { language, id } = useSelector(textPageGetFileSelector);
  const getDoc2htmlById  = useSelector(state => assets.getDoc2htmlById(state.assets));

  const location = useLocation();

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
