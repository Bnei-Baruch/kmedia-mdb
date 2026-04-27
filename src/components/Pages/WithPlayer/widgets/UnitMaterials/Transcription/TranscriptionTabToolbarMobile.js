import React from 'react';

import LanguageTextBtn from '../../../../WithText/Buttons/LanguageTextBtn';
import TextSettings from '../../../../WithText/Buttons/TextSettings/TextSettings';
import SearchOnPageBtn from '../../../../WithText/Buttons/SearchOnPageBtn';
import DownloadTextBtn from '../../../../WithText/Buttons/DownloadTextBtn';
import AddBookmarkBtn from '../../../../WithText/Buttons/AddBookmarkBtn';
import ShareTextModalBtn from '../../../../WithText/Buttons/ShareTextModalBtn';
import MoreOptionsBtn from '../../../../WithText/Buttons/MoreOptionsBtn';
import CopyLinkBtn from '../../../../WithText/Buttons/CopyLinkBtn';

const TranscriptionTabToolbarMobile = () => (
  <div className="text_toolbar">
    <div className="text_toolbar__buttons">
      <LanguageTextBtn />
      <TextSettings />
      <SearchOnPageBtn />
      <AddBookmarkBtn />
      <details className="text_toolbar__dropdown relative inline-block">
        <summary className="list-none cursor-pointer">
          <MoreOptionsBtn />
        </summary>
        <div className="absolute right-0 z-50 mt-1 bg-white rounded shadow-lg py-1">
          <div className="px-2 py-1">
            <DownloadTextBtn />
          </div>
          <div className="px-2 py-1">
            <ShareTextModalBtn />
          </div>
          <div className="px-2 py-1">
            <CopyLinkBtn />
          </div>
        </div>
      </details>
    </div>
  </div>
);

export default TranscriptionTabToolbarMobile;
