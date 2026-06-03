import { useState, useRef } from 'react';

import { useClickOutside } from '../../shared/useClickOutside';

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
import { ToolbarMenuContext } from '../../Pages/WithText/Buttons/ToolbarBtnTooltip';

const SourceToolbarMobile = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useClickOutside(() => setMenuOpen(false), [menuRef]);

  return (
    <div className="text_toolbar">
      <div className="text_toolbar__buttons">
        <TocToggleBtn />
        <LanguageTextBtn />
        <TextSettings />
        <SearchOnPageBtn />
        <div className="text_toolbar__dropdown" ref={menuRef}>
          <div onClick={() => setMenuOpen(v => !v)}>
            <MoreOptionsBtn />
          </div>
          {menuOpen && (
            <ToolbarMenuContext.Provider value={true}>
              <div className="menu">
                <div className="item"><AddBookmarkBtn /></div>
                <div className="item"><LinkToLessonsBtn /></div>
                <div className="item"><DownloadTextBtn /></div>
                <div className="item"><ShareTextModalBtn /></div>
                <div className="item"><CopyLinkBtn /></div>
              </div>
            </ToolbarMenuContext.Provider>
          )}
        </div>
      </div>
    </div>
  );
};

export default SourceToolbarMobile;
