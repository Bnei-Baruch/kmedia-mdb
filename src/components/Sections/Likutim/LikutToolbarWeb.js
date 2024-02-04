import React from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { Dropdown, Button } from 'semantic-ui-react';

import AddNoteBtn from '../../Pages/WithText/Buttons/AddNoteBtn';
import LanguageTextBtn from '../../Pages/WithText/Buttons/LanguageTextBtn';
import TextSettings from '../../Pages/WithText/Buttons/TextSettings/TextSettings';
import BookmarkBtn from '../../Pages/WithText/Buttons/BookmarkBtn';
import SearchOnPageBtn from '../../Pages/WithText/Buttons/SearchOnPageBtn';
import ExpandAllNotesBtn from '../../Pages/WithText/Buttons/ExpandAllNotesBtn';
import DownloadTextBtn from '../../Pages/WithText/Buttons/DownloadTextBtn';
import AdditionsVisibilityBtn from '../../Pages/WithText/Buttons/AdditionsVisibilityBtn';
import ShareTextBtn from '../../Pages/WithText/Buttons/ShareTextBtn';
import TagTextBtn from '../../Pages/WithText/Buttons/TagTextBtn';
import PrintBtn from '../../Pages/WithText/Buttons/PrintBtn';
import FullscreenTextBtn from '../../Pages/WithText/Buttons/FullscreenTextBtn';
import { textPageGetUrlInfoSelector } from '../../../redux/selectors';

const LikutToolbarWeb = () => {
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
        <BookmarkBtn />
        <AddNoteBtn />
        <ShareTextBtn />
        {
          hasNoSel && (
            <>
              <div className="divider" />
              <SearchOnPageBtn />
              <div className="computer-only">
                <ExpandAllNotesBtn />
              </div>
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
            </>
          )
        }
        <FullscreenTextBtn />
        <Dropdown
          item
          icon={null}
          trigger={
            (
              <Button
                circular
                icon={<span className="material-symbols-outlined">more_vert</span>}
              />
            )
          }
          pointing="top right"
          className="text_toolbar__dropdown"
        >
          <Dropdown.Menu>
            <Dropdown.Item>
              <ExpandAllNotesBtn />
            </Dropdown.Item>
            <Dropdown.Item>
              <DownloadTextBtn />
            </Dropdown.Item>
            <Dropdown.Item>
              <AdditionsVisibilityBtn />
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default LikutToolbarWeb;
