import React, { useState, useRef, useEffect } from 'react';

import TocToggleBtn from './TOC/TocToggleBtn';
import LanguageTextBtn from '../../Pages/WithText/Buttons/LanguageTextBtn';
import TextSettings from '../../Pages/WithText/Buttons/TextSettings/TextSettings';
import SearchOnPageBtn from '../../Pages/WithText/Buttons/SearchOnPageBtn';
import DownloadTextBtn from '../../Pages/WithText/Buttons/DownloadTextBtn';
import LinkToLessonsBtn from '../../Pages/WithText/Buttons/LinkToLessonsBtn';
import AddBookmarkBtn from '../../Pages/WithText/Buttons/AddBookmarkBtn';
import ShareTextModalBtn from '../../Pages/WithText/Buttons/ShareTextModalBtn';
import MoreOptionsBtn from '../../Pages/WithText/Buttons/MoreOptionsBtn';
import CopyLinkBtn from '../../Pages/WithText/Buttons/CopyLinkBtn';

const SourceToolbarMobile = () => {
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
      <div className="text_toolbar__buttons">
        <TocToggleBtn />
        <LanguageTextBtn />
        <TextSettings />
        <SearchOnPageBtn />
        <div className="text_toolbar__dropdown relative" ref={menuRef}>
          <div onClick={() => setMenuOpen(v => !v)}>
            <MoreOptionsBtn />
          </div>
          {menuOpen && (
            <div className="absolute right-0 z-10 mt-1 min-w-max bg-white rounded shadow-lg border">
              <div className="p-2"><AddBookmarkBtn /></div>
              <div className="p-2"><LinkToLessonsBtn /></div>
              <div className="p-2"><DownloadTextBtn /></div>
              <div className="p-2"><ShareTextModalBtn /></div>
              <div className="p-2"><CopyLinkBtn /></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SourceToolbarMobile;
