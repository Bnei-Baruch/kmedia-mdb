import React from 'react';
import AddNoteBtn from '../../../../Pages/WithText/Buttons/AddNoteBtn';
import LanguageTextBtn from '../../../../Pages/WithText/Buttons/LanguageTextBtn';
import TextSettings from '../../../../Pages/WithText/Buttons/TextSettings/TextSettings';
import BookmarkBtn from '../../../../Pages/WithText/Buttons/BookmarkBtn';
import SearchOnPageBtn from '../../../../Pages/WithText/Buttons/SearchOnPageBtn';
import ExpandAllNotesBtn from '../../../../Pages/WithText/Buttons/ExpandAllNotesBtn';
import DownloadTextBtn from '../../../../Pages/WithText/Buttons/DownloadTextBtn';
import AdditionsVisibilityBtn from '../../../../Pages/WithText/Buttons/AdditionsVisibilityBtn';
import ShareTextBtn from '../../../../Pages/WithText/Buttons/ShareTextBtn';
import TagTextBtn from '../../../../Pages/WithText/Buttons/TagTextBtn';
import PrintBtn from '../../../../Pages/WithText/Buttons/PrintBtn';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { textPageGetUrlInfoSelector } from '../../../../../redux/selectors';

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
        <BookmarkBtn />
        <AddNoteBtn />
        <ShareTextBtn />
        <div className="divider" />
        <SearchOnPageBtn />
        {
          hasNoSel && (
            <>
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

export default ArticleToolbarWeb;
