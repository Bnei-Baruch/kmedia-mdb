import PropTypes from 'prop-types';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { DeviceInfoContext } from '../app-contexts';
import { SCROLL_SEARCH_ID } from '../consts';
import { buildSearchLinkFromSelection, DOM_ROOT_ID } from './helper';
import DocToolbar from '../../components/shared/DocToolbar/DocToolbar';
import { selectors as textFile } from '../../../lib/redux/slices/textFileSlice/textFileSlice';

const ClientBehavior = ({ html, urlParams = '', pathname, children }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const language = useSelector(state => textFile.getSubjectInfo(state.textFile).language);

  const [searchUrl, setSearchUrl]     = useState('');
  const [barPosition, setBarPosition] = useState({});
  const [searchText, setSearchText]   = useState();
  const [wordOffset, setWordOffset]   = useState();
  const [searchQuery, setSearchQuery] = useState(null);

  const containerRef = useRef();

  useEffect(() => {
    const element = document.getElementById(SCROLL_SEARCH_ID);
    if (element !== null) {
      setTimeout(() => element.scrollIntoView(), 0);
    }
  }, []);

  useEffect(() => {
    const handleOnMouseUp = e => {
      if (isMobileDevice) {
        return false;
      }

      if (e.path?.some(x => (typeof x.className === 'string') && x.className.includes('search-on-doc--toolbar')))
        return false;

      const { url, text, query, element, wordOffset } = buildSearchLinkFromSelection(language, pathname);
      if (url) {
        setSearchText(text);
        setWordOffset(wordOffset);

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
  }, [containerRef, isMobileDevice, language, pathname, urlParams]);

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
        {
          (!isMobileDevice && !!searchUrl) && (
            <DocToolbar
              url={searchUrl}
              text={searchText}
              position={barPosition}
              properties={searchQuery}
              wordOffset={wordOffset}
            />
          )
        }
        {children}
        <div
          id={DOM_ROOT_ID}
          onMouseDown={handleOnMouseDown}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
};

export default ClientBehavior;
