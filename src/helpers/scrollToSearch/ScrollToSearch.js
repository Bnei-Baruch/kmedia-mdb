'use client';
import React, { useContext } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';

import { prepareScrollToSearch } from './helper';
import { useNotes } from '../../components/shared/DocToolbar/useNotes';
import { useLabels } from '../../components/shared/DocToolbar/useLabels';
import ClientBehavior from './ClientBehavior';
import { selectors as textFile } from '../../../lib/redux/slices/textFileSlice/textFileSlice';
import { selectors as assetsSelectors } from '../../../lib/redux/slices/assetSlice';
import LabelMark from '../../components/shared/DocToolbar/LabelMark';
import NoteMark from '../../components/shared/DocToolbar/NoteMark';
import { getLanguageDirection } from '../i18n-utils';
import { DeviceInfoContext } from '../app-contexts';

const ScrollToSearch = ({ urlParams = '', pathname }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const { id, language, fileId }   = useSelector(state => textFile.getSubjectInfo(state.textFile));

  const { notes, offsets: noteOffsets }   = useNotes(id, language);
  const { labels, offsets: labelOffsets } = useLabels(id, language);
  const doc2htmlById                      = useSelector(state => assetsSelectors.getDoc2htmlById(state.assets));

  const query                                = useSearchParams();
  const { srchstart, srchend, highlightAll } = query;

  const { data } = doc2htmlById[fileId] || {};
  const dir      = getLanguageDirection(language);
  const __html   = prepareScrollToSearch(
    data,
    { srchstart, srchend },
    highlightAll === 'true',
    [...labels, ...notes]
  );

  return (
    <ClientBehavior
      html={__html}
      urlParams={urlParams}
      pathname={pathname}
    >
      <div className={`label_bar ${dir}`}>
        {
          labels.map(l => (
            <LabelMark
              key={l.id}
              label={l}
              offset={labelOffsets[l.id]}
            />
          ))
        }
      </div>
      <div className={`notes_bar ${dir}`}>
        {
          !isMobileDevice && notes.map((n, i) => (
            <NoteMark
              key={n.id}
              note={n}
              offset={noteOffsets[n.id]}
            />
          ))
        }
      </div>
    </ClientBehavior>
  );
};

export default ScrollToSearch;
