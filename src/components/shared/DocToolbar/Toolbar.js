import React, {useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {withNamespaces} from 'react-i18next';
import {Button, Header, Icon, Label, Menu, MenuItem, Popup} from 'semantic-ui-react';
import {useSelector} from 'react-redux';

import {selectors} from '../../../redux/modules/auth';
import ShareBtn from './ShareBtn';
import CopyBtn from './CopyBtn';
import BookmarkBtn from './BookmarkBtn';

const DocToolbar = ({t, url, text, source, position, disable}) => {
  const [open, setOpen] = useState(!!url);
  const user = useSelector(state => selectors.getUser(state.auth));
  const contextRef = useRef();

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <div
      className="search-on-doc--bar-position"
      ref={contextRef}
      style={{top: `${position.y}px`, left: `${position.x}px`}}
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
          <ShareBtn url={'url'}/>
          <CopyBtn icon="copy" name={t('share-text.copy-text')} text={text}
                   popup={t('messages.text-copied-to-clipboard')}/>
          <CopyBtn icon="linkify" name={t('share-text.copy-link')} text={url}
                   popup={t('messages.link-copied-to-clipboard')}/>
          {source && user && <BookmarkBtn source={source} close={handleToggle}/>}
          {/*<NoteBtn />*/}
          {/*user&&<TagBtn />*/}
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
