import React from 'react';
import AddNoteBtn from '../../Pages/WithText/Buttons/AddNoteBtn';
import LanguageTextBtn from '../../Pages/WithText/Buttons/LanguageTextBtn';
import TextSettings from '../../Pages/WithText/Buttons/TextSettings/TextSettings';
import BookmarkBtn from '../../Pages/WithText/Buttons/BookmarkBtn';
import SearchOnPageBtn from '../../Pages/WithText/Buttons/SearchOnPageBtn';
import ExpandAllNotesBtn from '../../Pages/WithText/Buttons/ExpandAllNotesBtn';
import DownloadTextBtn from '../../Pages/WithText/Buttons/DownloadTextBtn';
import AdditionsVisibilityBtn from '../../Pages/WithText/Buttons/AdditionsVisibilityBtn';
import LinkToLessonsBtn from '../../Pages/WithText/Buttons/LinkToLessonsBtn';
import FullscreenTextBtn from '../../Pages/WithText/Buttons/FullscreenTextBtn';
import ShareTextBtn from '../../Pages/WithText/Buttons/ShareTextBtn';
import TagTextBtn from '../../Pages/WithText/Buttons/TagTextBtn';
import PrintBtn from '../../Pages/WithText/Buttons/PrintBtn';
import { useSelector } from 'react-redux';
import { selectors as textPage } from '../../../redux/modules/textPage';
import clsx from 'clsx';

const LikutToolbarWeb = () => {
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
              <div className="divider" />
              <FullscreenTextBtn />
            </>
          )
        }
      </div>
    </div>
  );
};

export default LikutToolbarWeb;
