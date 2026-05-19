import React from 'react';

import { ToolbarMenuContext } from '../../../../WithText/Buttons/ToolbarBtnTooltip';
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
      <details className="text_toolbar__dropdown">
        <summary className="list-none cursor-pointer">
          <MoreOptionsBtn />
        </summary>
        <ToolbarMenuContext.Provider value={true}>
          <div className="menu">
            <div className="item"><DownloadTextBtn /></div>
            <div className="item"><ShareTextModalBtn /></div>
            <div className="item"><CopyLinkBtn /></div>
          </div>
        </ToolbarMenuContext.Provider>
      </details>
    </div>
  </div>
);

export default TranscriptionTabToolbarMobile;
