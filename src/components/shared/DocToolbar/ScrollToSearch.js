import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

import { DeviceInfoContext, SessionInfoContext } from '../../../helpers/app-contexts';
import { getQuery } from '../../../helpers/url';
import {
  buildSearchLinkFromSelection,
  DOM_ROOT_ID,
  OFFSET_TEXT_SEPARATOR,
  prepareScrollToSearch
} from '../../../helpers/scrollToSearch/helper';
import Toolbar from './Toolbar';
import { MY_NAMESPACE_LABELS, SCROLL_SEARCH_ID } from '../../../helpers/consts';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors as my } from '../../../redux/modules/my';
import LabelMark from './LabelMark';
import { getLanguageDirection } from '../../../helpers/i18n-utils';

//its not mus be accurate number (average number letters per line)
const LETTERS_ON_LINE = 20;

const buildOffsets = labels => labels.map(({ properties: { srchstart, srchend } = {}, uid }) => {
  let start = Math.round(Number(srchstart?.split(OFFSET_TEXT_SEPARATOR)[1]) / LETTERS_ON_LINE);
  start     = Math.round(start / LETTERS_ON_LINE);

  let end = Math.round(Number(srchend?.split(OFFSET_TEXT_SEPARATOR)[1]) / LETTERS_ON_LINE);
  end     = Math.round(end / LETTERS_ON_LINE);

  return {
    start: Math.min(start, end) || Math.max(start, end),
    end: Math.max(start, end),
    uid
  };
}).reduce((acc, l, i, arr) => {
  const cross = arr.filter(x => !(x.start > l.end + 2 || x.end < l.start - 2));
  cross.sort((a, b) => (b.end - b.start) - (a.end - a.start));
  const x    = cross.findIndex(x => x.uid === l.uid);
  const y    = cross.filter(x => x.start - l.start === 0).findIndex(x => x.uid === l.uid);
  acc[l.uid] = { x, y };
  return acc;
}, {});

const ScrollToSearch = ({ source, data, language, urlParams = '', pathname }) => {

  const { enableShareText: { isShareTextEnabled, setEnableShareText } } = useContext(SessionInfoContext);
  const { isMobileDevice }                                              = useContext(DeviceInfoContext);

  const [searchUrl, setSearchUrl]     = useState();
  const [barPosition, setBarPosition] = useState({});
  const [searchText, setSearchText]   = useState();
  const [searchQuery, setSearchQuery] = useState();

  const containerRef = useRef();

  const location                             = useLocation();
  const { srchstart, srchend, highlightAll } = getQuery(location);
  const search                               = { srchstart, srchend };
  const labels                               = useSelector(state => my.getList(state.my, MY_NAMESPACE_LABELS));
  const offsets                              = useMemo(() => buildOffsets(labels), [labels]);
  const dir                                  = getLanguageDirection(language);

  const __html = useMemo(
    () => prepareScrollToSearch(data, search, highlightAll === 'true', labels),
    [data, search, labels]
  );

  const dispatch = useDispatch();

  const { subject_type, subject_uid } = source || {};
  useEffect(() => {
    if (subject_type && subject_uid) {
      dispatch(actions.fetch(MY_NAMESPACE_LABELS, { subject_type, subject_uid, language }));
    }
  }, [dispatch, subject_type, subject_uid, language]);

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
        const rect         = element.getBoundingClientRect();
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
        url={searchUrl}
        text={searchText}
        setPinned={handlePinned}
        isPinned={!isShareTextEnabled}
        position={barPosition}
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
      <div className="source__content">
        {renderShareBar()}
        <div className={`label_bar ${dir}`}>
          {
            labels.map((l, i) => <LabelMark label={l} offset={offsets[l.uid]} key={l.uid} />)
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
