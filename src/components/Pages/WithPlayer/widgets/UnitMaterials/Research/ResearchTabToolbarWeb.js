import React from 'react';
import AddNoteBtn from '../../../../WithText/Buttons/AddNoteBtn';
import LanguageTextBtn from '../../../../WithText/Buttons/LanguageTextBtn';
import TextSettings from '../../../../WithText/Buttons/TextSettings/TextSettings';
import BookmarkBtn from '../../../../WithText/Buttons/BookmarkBtn';
import SearchOnPageBtn from '../../../../WithText/Buttons/SearchOnPageBtn';
import ExpandAllNotesBtn from '../../../../WithText/Buttons/ExpandAllNotesBtn';
import DownloadTextBtn from '../../../../WithText/Buttons/DownloadTextBtn';
import AdditionsVisibilityBtn from '../../../../WithText/Buttons/AdditionsVisibilityBtn';
import LinkToLessonsBtn from '../../../../WithText/Buttons/LinkToLessonsBtn';
import FullscreenTextBtn from '../../../../WithText/Buttons/FullscreenTextBtn';
import ShareTextBtn from '../../../../WithText/Buttons/ShareTextBtn';
import TagTextBtn from '../../../../WithText/Buttons/TagTextBtn';
import PrintBtn from '../../../../WithText/Buttons/PrintBtn';
import { useSelector } from 'react-redux';
import { selectors as textPage } from '../../../../../../redux/modules/textPage';
import clsx from 'clsx';

const ResearchTabToolbarWeb = () => {
  const hasSel = !!useSelector(state => textPage.getUrlInfo(state.textPage)).select;

  return (
    <div className="text_toolbar">
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
              <DownloadTextBtn />
              <PrintBtn />
              <AdditionsVisibilityBtn />
            </>
          )
        }
      </div>
    </div>
  );
};

export default ResearchTabToolbarWeb;
