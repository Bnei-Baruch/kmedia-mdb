import React from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { Dropdown } from 'semantic-ui-react';

import AddCommentBtn from '../../../../Pages/WithText/Buttons/AddCommentBtn';
import LanguageTextBtn from '../../../../Pages/WithText/Buttons/LanguageTextBtn';
import TextSettings from '../../../../Pages/WithText/Buttons/TextSettings/TextSettings';
import AddBookmarkBtn from '../../../../Pages/WithText/Buttons/AddBookmarkBtn';
import SearchOnPageBtn from '../../../../Pages/WithText/Buttons/SearchOnPageBtn';
import DownloadTextBtn from '../../../../Pages/WithText/Buttons/DownloadTextBtn';
import AdditionsVisibilityBtn from '../../../../Pages/WithText/Buttons/AdditionsVisibilityBtn';
import ShareTextBtn from '../../../../Pages/WithText/Buttons/ShareTextBtn';
import TagTextBtn from '../../../../Pages/WithText/Buttons/TagTextBtn';
import PrintBtn from '../../../../Pages/WithText/Buttons/PrintBtn';
import { textPageGetUrlInfoSelector } from '../../../../../redux/selectors';
import LinkToLessonsBtn from '../../../../Pages/WithText/Buttons/LinkToLessonsBtn';
import FullscreenTextBtn from '../../../../Pages/WithText/Buttons/FullscreenTextBtn';
import MoreOptionsBtn from '../../../../Pages/WithText/Buttons/MoreOptionsBtn';
import CopyLinkBtn from '../../../../Pages/WithText/Buttons/CopyLinkBtn';

const ArticleToolbarWeb = () => {
  const hasNoSel = !useSelector(textPageGetUrlInfoSelector).select;

  return (
    <div className="text_toolbar">
      <div className={clsx('text_toolbar__buttons', { 'text_selected': !hasNoSel })}>
        {
          hasNoSel && (
            <>
              <TextSettings />
              <LanguageTextBtn />
              <div className="divider" />
            </>
          )
        }
        <TagTextBtn />
        <AddBookmarkBtn />
        <AddCommentBtn />
        <ShareTextBtn />
        <CopyLinkBtn />
        {
          hasNoSel && (
            <>
              <div className="divider" />
              <SearchOnPageBtn />
              <div className="computer-only">
                <PrintBtn />
              </div>
              <div className="computer-only">
                <DownloadTextBtn />
              </div>
              <div className="computer-only">
                <AdditionsVisibilityBtn />
              </div>
              <div className="divider computer-only" />

              <div className="computer-only">
                <LinkToLessonsBtn />
              </div>
              <div className="divider computer-only" />
            </>
          )
        }
        <FullscreenTextBtn />
        <Dropdown
          item
          icon={null}
          trigger={<MoreOptionsBtn />}
          pointing="top right"
          className="text_toolbar__dropdown"
        >
          <Dropdown.Menu>
            <Dropdown.Item>
              <DownloadTextBtn />
            </Dropdown.Item>
            <Dropdown.Item>
              <AdditionsVisibilityBtn />
            </Dropdown.Item>
            <Dropdown.Item>
              <LinkToLessonsBtn />
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default ArticleToolbarWeb;
