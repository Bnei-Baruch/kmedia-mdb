import { useState, useRef } from 'react';

import { useClickOutside } from '../../../../shared/useClickOutside';

import LanguageTextBtn from '../../../../Pages/WithText/Buttons/LanguageTextBtn';
import TextSettings from '../../../../Pages/WithText/Buttons/TextSettings/TextSettings';
import AddBookmarkBtn from '../../../../Pages/WithText/Buttons/AddBookmarkBtn';
import SearchOnPageBtn from '../../../../Pages/WithText/Buttons/SearchOnPageBtn';
import DownloadTextBtn from '../../../../Pages/WithText/Buttons/DownloadTextBtn';
import ShareTextBtn from '../../../../Pages/WithText/Buttons/ShareTextBtn';
import MoreOptionsBtn from '../../../../Pages/WithText/Buttons/MoreOptionsBtn';
import CopyLinkBtn from '../../../../Pages/WithText/Buttons/CopyLinkBtn';
import { ToolbarMenuContext } from '../../../../Pages/WithText/Buttons/ToolbarBtnTooltip';

const ArticleToolbarMobile = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useClickOutside(() => setMenuOpen(false), [menuRef]);

  return (
    <div className="text_toolbar">
      <div className="text_toolbar__buttons">
        <LanguageTextBtn />
        <TextSettings />
        <SearchOnPageBtn />
        <AddBookmarkBtn />
        <div className="text_toolbar__dropdown" ref={menuRef}>
          <div onClick={() => setMenuOpen(v => !v)}>
            <MoreOptionsBtn />
          </div>
          {menuOpen && (
            <ToolbarMenuContext.Provider value={true}>
              <div className="menu">
                <div className="item"><DownloadTextBtn /></div>
                <div className="item"><ShareTextBtn /></div>
                <div className="item"><CopyLinkBtn /></div>
              </div>
            </ToolbarMenuContext.Provider>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleToolbarMobile;
