import React, { useState, useRef, useEffect } from 'react';

import AddCommentBtn from '../../Pages/WithText/Buttons/AddCommentBtn';
import TocToggleBtn from './TOC/TocToggleBtn';
import LanguageTextBtn from '../../Pages/WithText/Buttons/LanguageTextBtn';
import TextSettings from '../../Pages/WithText/Buttons/TextSettings/TextSettings';
import AddBookmarkBtn from '../../Pages/WithText/Buttons/AddBookmarkBtn';
import SearchOnPageBtn from '../../Pages/WithText/Buttons/SearchOnPageBtn';
import DownloadTextBtn from '../../Pages/WithText/Buttons/DownloadTextBtn';
import AdditionsModeBtn from '../../Pages/WithText/Buttons/AdditionsMode/AdditionsModeBtn';
import LinkToLessonsBtn from '../../Pages/WithText/Buttons/LinkToLessonsBtn';
import ToggleScanBtn from '../../Pages/WithText/Buttons/ToggleScan/ToggleScanBtn';
import FullscreenTextBtn from '../../Pages/WithText/Buttons/FullscreenTextBtn';
import ShareTextBtn from '../../Pages/WithText/Buttons/ShareTextBtn';
import TagTextBtn from '../../Pages/WithText/Buttons/TagTextBtn';
import PrintBtn from '../../Pages/WithText/Buttons/PrintBtn';
import MoreOptionsBtn from '../../Pages/WithText/Buttons/MoreOptionsBtn';
import CopyLinkBtn from '../../Pages/WithText/Buttons/CopyLinkBtn';
import { ToolbarMenuContext } from '../../Pages/WithText/Buttons/ToolbarBtnTooltip';

const SourceToolbarWeb = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="text_toolbar">
      <TocToggleBtn />
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
        <div className="computer-only">
          <DownloadTextBtn/>
        </div>
        <div className="computer-only">
          <PrintBtn/>
        </div>
        <div className="divider computer-only"/>

        <div className="computer-only">
          <AdditionsModeBtn/>
        </div>
        <div className="computer-only">
          <LinkToLessonsBtn/>
        </div>
        <div className="computer-only">
          <ToggleScanBtn/>
        </div>
        <div className="divider computer-only"/>
        <FullscreenTextBtn/>
        <div className="text_toolbar__dropdown" ref={menuRef}>
          <div onClick={() => setMenuOpen(v => !v)}>
            <MoreOptionsBtn/>
          </div>
          {menuOpen && (
            <ToolbarMenuContext.Provider value={true}>
              <div className="menu">
                <div className="item"><DownloadTextBtn/></div>
                <div className="item"><AdditionsModeBtn/></div>
                <div className="item"><ToggleScanBtn/></div>
                <div className="item"><LinkToLessonsBtn/></div>
              </div>
            </ToolbarMenuContext.Provider>
          )}
        </div>
      </div>
      <div className="flex_basis_150">&nbsp;</div>
    </div>
  );
};

export default SourceToolbarWeb;
