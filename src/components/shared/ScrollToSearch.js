import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

import { DeviceInfoContext, SessionInfoContext } from '../../helpers/app-contexts';
import { getQuery } from '../../helpers/url';
import { buildSearchLinkFromSelection, DOM_ROOT_ID, prepareScrollToSearch } from '../../helpers/scrollToSearch/helper';
import ShareBar from './ShareSelected';
import { SCROLL_SEARCH_ID } from '../../helpers/consts';

const ScrollToSearch = ({ data, language, urlParams='' }) => {

  const { enableShareText: { isShareTextEnabled, setEnableShareText } } = useContext(SessionInfoContext);
  const { isMobileDevice }                                              = useContext(DeviceInfoContext);

  const [searchUrl, setSearchUrl]   = useState();
  const [searchText, setSearchText] = useState();

  const location                             = useLocation();
  const { srchstart, srchend, highlightAll } = getQuery(location);
  const search                               = { srchstart, srchend };

  useEffect(() => {
    const element = document.getElementById(SCROLL_SEARCH_ID);
    if (element === null) {
      return;
    }

    setTimeout(() => element.scrollIntoView(), 0);
  }, [data]);

  useEffect(() => {
    const handleOnMouseUp = e => {
      if (isMobileDevice || !isShareTextEnabled) {
        return false;
      }

      const { url, text } = buildSearchLinkFromSelection(language);
      if (url) {
        setSearchText(text);
        setSearchUrl(`${url}&${urlParams}`);
      }

      return false;
    };

    document.addEventListener('mouseup', handleOnMouseUp);
    return () => document.removeEventListener('mouseup', handleOnMouseUp);
  }, [isMobileDevice, isShareTextEnabled, language]);

  if (!data) {
    return null;
  }

  const disableShareBar = () => setEnableShareText(false);

  const renderShareBar = () => {
    if (isMobileDevice || !searchUrl)
      return null;

    return <ShareBar url={searchUrl} text={searchText} disable={disableShareBar} />;
  };

  const handleOnMouseDown = e => {
    if (isMobileDevice || !isShareTextEnabled) {
      return false;
    }

    setSearchUrl(null);
    return false;
  };

  return (
    <div className="search-on-page--container">
      {isShareTextEnabled && renderShareBar()}
      {
        <div
          id={DOM_ROOT_ID}
          onMouseDown={handleOnMouseDown}
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
