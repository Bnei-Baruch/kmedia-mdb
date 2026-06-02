import React, { useState, useRef } from 'react';

import { useClickOutside } from '../../../../../shared/useClickOutside';
import { ToolbarMenuContext } from '../../../../WithText/Buttons/ToolbarBtnTooltip';
import AddCommentBtn from '../../../../WithText/Buttons/AddCommentBtn';
import LanguageTextBtn from '../../../../WithText/Buttons/LanguageTextBtn';
import TextSettings from '../../../../WithText/Buttons/TextSettings/TextSettings';
import AddBookmarkBtn from '../../../../WithText/Buttons/AddBookmarkBtn';
import SearchOnPageBtn from '../../../../WithText/Buttons/SearchOnPageBtn';
import DownloadTextBtn from '../../../../WithText/Buttons/DownloadTextBtn';
import AdditionsModeBtn from '../../../../WithText/Buttons/AdditionsMode/AdditionsModeBtn';
import ShareTextBtn from '../../../../WithText/Buttons/ShareTextBtn';
import TagTextBtn from '../../../../WithText/Buttons/TagTextBtn';
import PrintBtn from '../../../../WithText/Buttons/PrintBtn';
import MoreOptionsBtn from '../../../../WithText/Buttons/MoreOptionsBtn';
import CopyLinkBtn from '../../../../WithText/Buttons/CopyLinkBtn';
import TocToggleBtn from '../../../../../Sections/Source/TOC/TocToggleBtn';

const SourceTabToolbarWeb = ({ hasToc }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  useClickOutside(() => setMenuOpen(false), [menuRef]);

  return (
    <div className="text_toolbar">
      {hasToc && <TocToggleBtn/>}
      <div className="text_toolbar__buttons">
        <TextSettings/>
        <LanguageTextBtn/>
        <div className="divider"/>
        <TagTextBtn/>
        <AddBookmarkBtn/>
        <AddCommentBtn/>
        <ShareTextBtn/>
        <CopyLinkBtn/>
        <div className="divider"/>
        <SearchOnPageBtn/>
        <div className="hidden xl:block">
          <DownloadTextBtn/>
        </div>
        <div className="hidden xl:block">
          <PrintBtn/>
        </div>
        <div className="hidden xl:block">
          <AdditionsModeBtn/>
        </div>
        <div className="text_toolbar__dropdown xl:hidden" ref={menuRef}>
          <div onClick={() => setMenuOpen(v => !v)}>
            <MoreOptionsBtn/>
          </div>
          {menuOpen && (
            <ToolbarMenuContext.Provider value={true}>
              <div className="menu">
                <div className="item"><DownloadTextBtn/></div>
                <div className="item"><AdditionsModeBtn/></div>
              </div>
            </ToolbarMenuContext.Provider>
          )}
        </div>
      </div>
    </div>
  );
};

export default SourceTabToolbarWeb;
