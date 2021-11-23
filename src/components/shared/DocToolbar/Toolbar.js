import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Container, Menu, Popup, } from 'semantic-ui-react';

import ShareBtn from './ShareBtn';
import CopyBtn from './CopyBtn';
import NoteBtn from './NoteBtn';
import BookmarkBtn from './BookmarkBtn';
import { useSelector } from 'react-redux';
import { selectors } from '../../../redux/modules/auth';

const DocToolbar = ({ t, url, text, source, position }) => {
  const [open, setOpen] = useState(!!url);
  const user            = useSelector(state => selectors.getUser(state.auth));
  const contextRef      = useRef();

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      <div
        className="search-on-doc--bar-position"
        ref={contextRef}
        style={{ top: `${position.y}px`, left: `${position.x}px` }}
      >
        <div className="search-on-doc--toolbar">

          <Menu inverted compact>
            <ShareBtn url={'url'} />
            <CopyBtn icon="copy" name={t('share-text.copy-text')} text={text} popup={t('messages.text-copied-to-clipboard')} />
            <CopyBtn icon="linkify" name={t('share-text.copy-link')} text={url} popup={t('messages.link-copied-to-clipboard')} />
            {source && user && <BookmarkBtn source={source} close={handleToggle} />}
            {/*<NoteBtn />*/}
          </Menu>
        </div>
      </div>
      {/*

      <Popup
        className="search-on-doc--toolbar"
        basic
        position={`bottom left`}
        trigger={<div />}
        open={open}
        onOpen={handleToggle}
        hideOnScroll
        flowing
      >
        <Popup.Content>
          <Menu inverted>
            <ShareBtn url={'url'} />
            <CopyBtn icon="copy" name={t('share-text.copy-text')} text={text} popup={t('messages.text-copied-to-clipboard')} />
            <CopyBtn icon="linkify" name={t('share-text.copy-link')} text={url} popup={t('messages.link-copied-to-clipboard')} />
            {source && user && <BookmarkBtn source={source} close={handleToggle} />}
            <NoteBtn />
          </Menu>
        </Popup.Content>
      </Popup>*/}
    </>
  );
};

DocToolbar.propTypes = {
  t: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
  disable: PropTypes.func,
  query: PropTypes.object,
};

export default withNamespaces()(DocToolbar);
