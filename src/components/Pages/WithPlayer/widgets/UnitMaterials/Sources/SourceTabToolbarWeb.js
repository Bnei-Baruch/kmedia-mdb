import React from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { Dropdown, Button } from 'semantic-ui-react';

import AddNoteBtn from '../../../../WithText/Buttons/AddNoteBtn';
import LanguageTextBtn from '../../../../WithText/Buttons/LanguageTextBtn';
import TextSettings from '../../../../WithText/Buttons/TextSettings/TextSettings';
import BookmarkBtn from '../../../../WithText/Buttons/BookmarkBtn';
import SearchOnPageBtn from '../../../../WithText/Buttons/SearchOnPageBtn';
import ExpandAllNotesBtn from '../../../../WithText/Buttons/ExpandAllNotesBtn';
import DownloadTextBtn from '../../../../WithText/Buttons/DownloadTextBtn';
import AdditionsVisibilityBtn from '../../../../WithText/Buttons/AdditionsVisibilityBtn';
import ShareTextBtn from '../../../../WithText/Buttons/ShareTextBtn';
import TagTextBtn from '../../../../WithText/Buttons/TagTextBtn';
import PrintBtn from '../../../../WithText/Buttons/PrintBtn';
import { textPageGetUrlInfoSelector } from '../../../../../../redux/selectors';
import TocToggleBtn from '../../../../../Sections/Source/TOC/TocToggleBtn';

const SourceTabToolbarWeb = ({ needTOC }) => {
  const hasNoSel = !useSelector(textPageGetUrlInfoSelector).select;

  return (
    <div className="text_toolbar">
      <div className={clsx('text_toolbar__buttons', { 'text_selected': !hasNoSel })}>
        {
          hasNoSel && (
            <>
              {needTOC && <TocToggleBtn />}
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

export default SourceTabToolbarWeb;
