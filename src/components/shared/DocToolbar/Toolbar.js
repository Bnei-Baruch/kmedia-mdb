import React, {useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {withNamespaces} from 'react-i18next';
import {Header, Icon, Label, Menu, Popup} from 'semantic-ui-react';

import ShareBtn from './ShareBtn';
import BookmarkBtn from './BookmarkBtn';
import CopyTextBtn from "./CopyTextBtn";
import CopyLinkBtn from "./CopyLinkBtn";

const DocToolbar = ({t, url, text, source, position, disable}) => {
  const [open, setOpen] = useState(!!url);
  const contextRef = useRef();

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <div
      className="search-on-doc--bar-position"
      ref={contextRef}
      style={{top: `${position.y}px`}}
    >
      <div className="search-on-doc--toolbar">
        <Label
          color='grey'
          floating
          circular
          onClick={disable}
        >
          <Popup
            content={t('share-text.disable-share')}
            trigger={
              <Icon name="close" circular bordered={false} className="no-margin no-shadow"/>
            }
          />
        </Label>
        <Header
          as="h3"
          content={t('share-text.docbar-title')}
          textAlign="center"
        />
        <Menu compact inverted>
          <ShareBtn url={url}/>
          <CopyLinkBtn text={url}/>
          <CopyTextBtn text={text}/>
          {source && <BookmarkBtn source={source} close={handleToggle}/>}
          {/*<TagBtn />*/}
          {/*<NoteBtn />*/}
        </Menu>
      </div>
    </div>
  );
};

DocToolbar.propTypes = {
  t: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
  disable: PropTypes.func,
  query: PropTypes.object,
};

export default withNamespaces()(DocToolbar);
