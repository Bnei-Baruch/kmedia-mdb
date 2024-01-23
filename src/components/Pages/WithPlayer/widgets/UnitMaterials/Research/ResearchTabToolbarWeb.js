import React from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';

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

const ResearchTabToolbarWeb = () => {
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
