import React, {useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {withNamespaces} from 'react-i18next';
import {Button, Confirm, Header, Menu, MenuItem, Popup} from 'semantic-ui-react';

import ShareBtn from './ShareBtn';
import BookmarkBtn from './BookmarkBtn';
import CopyTextBtn from './CopyTextBtn';
import CopyLinkBtn from './CopyLinkBtn';
import clsx from 'clsx';
import LabelBtn from './LabelBtn';
import {actions} from "../../../redux/modules/my";
import {MY_NAMESPACE_FOLDERS} from "../../../helpers/consts";
import {useSelector} from "react-redux";
import {selectors as settings} from "../../../redux/modules/settings";
import {getLanguageDirection} from "../../../helpers/i18n-utils";
import SelectTopicsModal from "../SelectTopicsModal/SelectTopicsModal";

const DocToolbar = ({t, url, text, source, position, setPinned, isPinned}) => {
  const [open, setOpen] = useState(!!url);

  const contextRef = useRef();

  const language = useSelector(state => settings.getLanguage(state.settings));
  const dir = getLanguageDirection(language);

  const handleToggle = () => {
    setOpen(!open);
  };


  return open && (
    <div
      className={clsx('search-on-doc--bar-position', {'pinned': isPinned})}
      ref={contextRef}
      style={{top: `${position.y}px`}}
    >
      <div className="search-on-doc--toolbar">
        <Popup
          content={t('share-text.disable-share')}
          trigger={<Button
            inverted
            floated={isPinned ? 'none' : 'right'}
            icon="close"
            circular
            onClick={handleToggle}
          />}
        />
        <Popup
          content={isPinned ? t('share-text.unpin') : t('share-text.pin')}
          trigger={<Button
            inverted={!isPinned}
            className="pin"
            icon="thumbtack"
            floated="right"
            onClick={setPinned}
          />}
        />
        {
          !isPinned &&
          (
            <>
              <Header
                as="h3"
                textAlign="center"
              >
                <Header.Content>
                  {t('share-text.docbar-title')}
                </Header.Content>
              </Header>
              <Menu inverted borderless>
                <ShareBtn url={url}/>
                <CopyLinkBtn text={url}/>
                <CopyTextBtn text={text}/>
                {source && <BookmarkBtn source={source} close={handleToggle}/>}
                {source && <LabelBtn source={source} close={handleToggle}/>}
              </Menu>
            </>
          )
        }
      </div>
    </div>
  );
};

DocToolbar.propTypes = {
  t: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
  setPinned: PropTypes.func,
  isPinned: PropTypes.bool,
  query: PropTypes.object,
};

export default withNamespaces()(DocToolbar);
