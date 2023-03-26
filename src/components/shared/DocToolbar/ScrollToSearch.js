import PropTypes from 'prop-types';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { DeviceInfoContext, SessionInfoContext } from '../../../helpers/app-contexts';
import { SCROLL_SEARCH_ID } from '../../../helpers/consts';
import { getLanguageDirection } from '../../../helpers/i18n-utils';
import {
  buildSearchLinkFromSelection,
  DOM_ROOT_ID,
  prepareScrollToSearch
} from '../../../helpers/scrollToSearch/helper';
import { getQuery } from '../../../helpers/url';
import LabelMark from './LabelMark';
import Toolbar from './Toolbar';
import { useNotes } from './useNotes';
import { useLabels } from './useLabels';
import NoteMark from './NoteMark';

const ScrollToSearch = ({ source, label, data, language, urlParams = '', pathname }) => {
  const { enableShareText: { isShareTextEnabled, setEnableShareText } } = useContext(SessionInfoContext);
  const { isMobileDevice }                                              = useContext(DeviceInfoContext);

  const [searchUrl, setSearchUrl]     = useState();
  const [barPosition, setBarPosition] = useState({});
  const [searchText, setSearchText]   = useState();
  const [searchQuery, setSearchQuery] = useState();

  const containerRef = useRef();

  const { content_unit } = label || {};

  const { notes, offsets: noteOffsets } = useNotes(content_unit, language);
  const { labels, offsets }             = useLabels(content_unit, language);

  const location                             = useLocation();
  const { srchstart, srchend, highlightAll } = getQuery(location);

  const search = useMemo(() => ({ srchstart, srchend }), [srchstart, srchend]);

  const dir = getLanguageDirection(language);

  const __html = prepareScrollToSearch(data, search, highlightAll === 'true', [...labels, ...notes]);

  useEffect(() => {
    const element = document.getElementById(SCROLL_SEARCH_ID);
    if (element === null) {
      return;
    }

    setTimeout(() => element.scrollIntoView(), 0);
  }, [data]);

  useEffect(() => {
    const handleOnMouseUp = e => {
      if (isMobileDevice) {
        return false;
      }

      if (e.path?.some(x => (typeof x.className === 'string') && x.className.includes('search-on-doc--toolbar')))
        return false;

      const { url, text, query, element } = buildSearchLinkFromSelection(language, pathname);
      if (url) {
        setSearchText(text);

        const selEl        = window.getSelection().getRangeAt(0) || element;
        const rect         = selEl.getBoundingClientRect();
        const recContainer = containerRef.current?.getBoundingClientRect();
        setBarPosition({ y: rect.top - recContainer.top });
        setSearchUrl(`${url}&${urlParams}`);
        setSearchQuery(query);
      }

      return false;
    };

    document.addEventListener('mouseup', handleOnMouseUp);
    return () => document.removeEventListener('mouseup', handleOnMouseUp);
  }, [containerRef, isMobileDevice, isShareTextEnabled, language, pathname, urlParams]);

  if (!data) {
    return null;
  }

  const handlePinned = () => {
    setEnableShareText(!isShareTextEnabled);
  };

  const renderShareBar = () => {
    if (isMobileDevice || !searchUrl)
      return null;
    source.properties = { ...source?.properties || {}, ...searchQuery };
    return (
      <Toolbar
        source={source}
        label={content_unit ? { content_unit, properties: searchQuery } : null}
        url={searchUrl}
        text={searchText}
        setPinned={handlePinned}
        isPinned={!isShareTextEnabled}
        position={barPosition}
        language={language}
      />
    );
  };

  const handleOnMouseDown = e => {
    if (isMobileDevice) {
      return false;
    }

    setSearchUrl(null);
    return false;
  };

  return (
    <div
      className="search-on-doc--container"
      ref={containerRef}
    >
      <div className={`source__content ${language}_styles`}>
        {renderShareBar()}
        <div className={`label_bar ${dir}`}>
          {
            labels.map(l => <LabelMark label={l} offset={offsets[l.id]} key={l.id} />)
          }
        </div>
        <div className={`notes_bar ${dir}`}>
          {
            isMobileDevice && notes.map((n, i) => <NoteMark note={n} key={n.id} offset={noteOffsets[n.id]} />)
          }
        </div>
        <div
          id={DOM_ROOT_ID}
          onMouseDown={handleOnMouseDown}
          dangerouslySetInnerHTML={{ __html }}
        />
      </div>
    </div>
  );
};

ScrollToSearch.propTypes = {
  data: PropTypes.any,
};

export default ScrollToSearch;
