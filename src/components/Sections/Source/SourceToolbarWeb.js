import React from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';

import AddNoteBtn from '../../Pages/WithText/Buttons/AddNoteBtn';
import TocToggleBtn from './TOC/TocToggleBtn';
import LanguageTextBtn from '../../Pages/WithText/Buttons/LanguageTextBtn';
import TextSettings from '../../Pages/WithText/Buttons/TextSettings/TextSettings';
import BookmarkBtn from '../../Pages/WithText/Buttons/BookmarkBtn';
import SearchOnPageBtn from '../../Pages/WithText/Buttons/SearchOnPageBtn';
import ExpandAllNotesBtn from '../../Pages/WithText/Buttons/ExpandAllNotesBtn';
import DownloadTextBtn from '../../Pages/WithText/Buttons/DownloadTextBtn';
import AdditionsVisibilityBtn from '../../Pages/WithText/Buttons/AdditionsVisibilityBtn';
import LinkToLessonsBtn from '../../Pages/WithText/Buttons/LinkToLessonsBtn';
import ToggleScanBtn from '../../Pages/WithText/Buttons/ToggleScanBtn';
import FullscreenTextBtn from '../../Pages/WithText/Buttons/FullscreenTextBtn';
import ShareTextBtn from '../../Pages/WithText/Buttons/ShareTextBtn';
import TagTextBtn from '../../Pages/WithText/Buttons/TagTextBtn';
import PrintBtn from '../../Pages/WithText/Buttons/PrintBtn';
import { textPageGetUrlInfoSelector } from '../../../redux/selectors';

const SourceToolbarWeb = () => {
  const hasSel = !!useSelector(textPageGetUrlInfoSelector).select;

  return (
    <div className="text_toolbar">
      <TocToggleBtn />
      <div className={clsx('text_toolbar__buttons', { 'text_selected': hasSel })}>
        {
          !hasSel && (
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
          !hasSel && (
            <>
              <div className="divider" />
              <SearchOnPageBtn />
              <ExpandAllNotesBtn />
              <PrintBtn />
              <DownloadTextBtn />
              <AdditionsVisibilityBtn />
              <div className="divider" />
              <LinkToLessonsBtn />
              <ToggleScanBtn />
              <div className="divider" />
            </>
          )
        }
        <FullscreenTextBtn />
      </div>
      <div className="flex_basis_150">&nbsp;</div>
    </div>
  );
};

export default SourceToolbarWeb;