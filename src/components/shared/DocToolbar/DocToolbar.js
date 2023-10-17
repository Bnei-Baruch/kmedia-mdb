import React, { useRef, useState, useContext } from 'react';
import { useTranslation } from 'next-i18next';
import { Button, Header, Menu, Popup } from 'semantic-ui-react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';

import BookmarkBtn from './BookmarkBtn';
import CopyTextBtn from './CopyTextBtn';
import CopyLinkBtn from './CopyLinkBtn';
import ShareBtn from './ShareBtn';
import TagTextLabelBtn from './TagTextLabelBtn';
import AddNoteBtn from './AddNoteBtn';
import PlayByTextBtn from './PlayByTextBtn';
import { selectors as assets } from '../../../../lib/redux/slices/assetSlice/assetSlice';
import { selectors as textFile } from '../../../../lib/redux/slices/textFileSlice/textFileSlice';
import { seek, setPip } from '../../../../pkg/jwpAdapter/adapter';
import { SessionInfoContext } from '../../../helpers/app-contexts';

const DocToolbar = ({ url, text, position, properties, wordOffset }) => {
  const {
          enableShareText: {
            isShareTextEnabled: isPinned,
            setEnableShareText
          } = false
        } = useContext(SessionInfoContext);

  const [open, setOpen] = useState(!!url);
  const { t }           = useTranslation();
  const contextRef      = useRef();

  const hasTimeCode   = useSelector(state => assets.hasTimeCode(state.assets));
  const timeCodeByPos = useSelector(state => assets.getTimeCode(state.assets));
  const subject       = useSelector(state => textFile.getSubjectInfo(state.textFile));
  subject.properties  = { ...subject.properties, properties };

  const handlePlayByText = () => {
    if (!wordOffset) return;
    const startTime = timeCodeByPos(wordOffset - 2);
    seek(startTime).play();
    setPip(true);
    setOpen(!open);
  };
  const handleToggle     = () => setOpen(!open);
  const handlePinned     = () => setEnableShareText(!isPinned);

  return open && (
    <div
      className={clsx('search-on-doc--bar-position', { 'pinned': isPinned })}
      ref={contextRef}
      style={{ top: `${position.y}px` }}
    >
      <div className="search-on-doc--toolbar">
        <Popup
          content={t('share-text.disable-share')}
          trigger={
            <Button
              inverted={!isPinned}
              floated={isPinned ? null : 'right'}
              icon="close"
              circular
              onClick={handleToggle}
            />
          }
        />
        <Popup
          content={isPinned ? t('share-text.unpin') : t('share-text.pin')}
          trigger={
            <Button
              inverted={!isPinned}
              className="pin"
              icon="thumbtack"
              floated="right"
              circular
              onClick={handlePinned}
            />
          }
        />
        {
          isPinned && (
            <>
              <AddNoteBtn properties={subject} toggleToolbar={handleToggle} />
              {hasTimeCode && <PlayByTextBtn handlePlay={handlePlayByText} />}
            </>
          )
        }
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
                <ShareBtn url={url} />
                <CopyLinkBtn text={url} />
                <CopyTextBtn text={text} />
                <BookmarkBtn close={handleToggle} />
                <TagTextLabelBtn close={handleToggle} />
              </Menu>
            </>
          )
        }
      </div>
    </div>
  );
};

export default DocToolbar;
