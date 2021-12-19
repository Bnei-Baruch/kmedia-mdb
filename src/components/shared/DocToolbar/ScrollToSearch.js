import React, { useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

import { DeviceInfoContext, SessionInfoContext } from '../../../helpers/app-contexts';
import { getQuery } from '../../../helpers/url';
import {
  buildSearchLinkFromSelection,
  DOM_ROOT_ID,
  prepareScrollToSearch
} from '../../../helpers/scrollToSearch/helper';
import Toolbar from './Toolbar';
import { SCROLL_SEARCH_ID } from '../../../helpers/consts';

const ScrollToSearch = ({ source, data, language, urlParams = '', pathname }) => {

  const { enableShareText: { isShareTextEnabled, setEnableShareText } } = useContext(SessionInfoContext);
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const [searchUrl, setSearchUrl] = useState('test');
  const [barPosition, setBarPosition] = useState({});
  const [searchText, setSearchText] = useState();
  const [searchQuery, setSearchQuery] = useState();

  const containerRef = useRef();

  const location = useLocation();
  const { srchstart, srchend, highlightAll } = getQuery(location);
  const search = { srchstart, srchend };

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
        const rect = element.getBoundingClientRect();
        const recContainer = containerRef.current?.getBoundingClientRect();
        setBarPosition({ y: rect.top - recContainer.top });
        setSearchUrl(`${url}&${urlParams}`);
        setSearchQuery(query);
      }

      return false;
    };

    document.addEventListener('mouseup', handleOnMouseUp);
    return () => document.removeEventListener('mouseup', handleOnMouseUp);
  }, [containerRef, isMobileDevice, isShareTextEnabled, language, pathname]);

  if (!data) {
    return null;
  }


  const handlePinned = () => {
    setEnableShareText(!isShareTextEnabled);
  }

  const renderShareBar = () => {
    if (isMobileDevice || !searchUrl)
      return null;
    source.data = { ...source?.data || {}, ...searchQuery };
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
      {renderShareBar()}
      {
        <div
          id={DOM_ROOT_ID}
          onMouseDown={handleOnMouseDown}
          className="source__content"
          dangerouslySetInnerHTML={{ __html: prepareScrollToSearch(data, search, highlightAll === 'true') }}
        />
      }
    </div>
  );
};

ScrollToSearch.propTypes = {
  data: PropTypes.any,
};

export default ScrollToSearch;
