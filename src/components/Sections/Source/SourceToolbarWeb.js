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
        <div className="text_toolbar__dropdown relative" ref={menuRef}>
          <div onClick={() => setMenuOpen(v => !v)}>
            <MoreOptionsBtn/>
          </div>
          {menuOpen && (
            <div className="absolute right-0 z-10 mt-1 min-w-max bg-white rounded shadow-lg border">
              <div className="p-2"><DownloadTextBtn/></div>
              <div className="p-2"><AdditionsModeBtn/></div>
              <div className="p-2"><ToggleScanBtn/></div>
              <div className="p-2"><LinkToLessonsBtn/></div>
            </div>
          )}
        </div>
      </div>
      <div className="flex_basis_150">&nbsp;</div>
    </div>
  );
};

export default SourceToolbarWeb;
