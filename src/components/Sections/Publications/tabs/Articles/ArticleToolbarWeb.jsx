import { useState, useRef } from 'react';

import { useClickOutside } from '../../../../shared/useClickOutside';

import AddCommentBtn from '../../../../Pages/WithText/Buttons/AddCommentBtn';
import LanguageTextBtn from '../../../../Pages/WithText/Buttons/LanguageTextBtn';
import TextSettings from '../../../../Pages/WithText/Buttons/TextSettings/TextSettings';
import AddBookmarkBtn from '../../../../Pages/WithText/Buttons/AddBookmarkBtn';
import SearchOnPageBtn from '../../../../Pages/WithText/Buttons/SearchOnPageBtn';
import DownloadTextBtn from '../../../../Pages/WithText/Buttons/DownloadTextBtn';
import AdditionsModeBtn from '../../../../Pages/WithText/Buttons/AdditionsMode/AdditionsModeBtn';
import ShareTextBtn from '../../../../Pages/WithText/Buttons/ShareTextBtn';
import TagTextBtn from '../../../../Pages/WithText/Buttons/TagTextBtn';
import PrintBtn from '../../../../Pages/WithText/Buttons/PrintBtn';
import LinkToLessonsBtn from '../../../../Pages/WithText/Buttons/LinkToLessonsBtn';
import FullscreenTextBtn from '../../../../Pages/WithText/Buttons/FullscreenTextBtn';
import MoreOptionsBtn from '../../../../Pages/WithText/Buttons/MoreOptionsBtn';
import CopyLinkBtn from '../../../../Pages/WithText/Buttons/CopyLinkBtn';
import { ToolbarMenuContext } from '../../../../Pages/WithText/Buttons/ToolbarBtnTooltip';

const ArticleToolbarWeb = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useClickOutside(() => setMenuOpen(false), [menuRef]);

  return (
    <div className="text_toolbar">
      <div className="text_toolbar__buttons">
        <TextSettings />
        <LanguageTextBtn />
        <div className="divider" />
        <TagTextBtn />
        <AddBookmarkBtn />
        <AddCommentBtn />
        <ShareTextBtn />
        <CopyLinkBtn />
        <div className="divider" />
        <SearchOnPageBtn />
        <div className="hidden xl:block">
          <PrintBtn />
        </div>
        <div className="hidden xl:block">
          <DownloadTextBtn />
        </div>
        <div className="hidden xl:block">
          <AdditionsModeBtn />
        </div>
        <div className="divider hidden xl:block" />

        <div className="hidden xl:block">
          <LinkToLessonsBtn />
        </div>
        <div className="divider hidden xl:block" />
        <FullscreenTextBtn />
        <div className="text_toolbar__dropdown xl:hidden!" ref={menuRef}>
          <div onClick={() => setMenuOpen(v => !v)}>
            <MoreOptionsBtn />
          </div>
          {menuOpen && (
            <ToolbarMenuContext.Provider value={true}>
              <div className="menu">
                <div className="item"><DownloadTextBtn /></div>
                <div className="item"><AdditionsModeBtn /></div>
                <div className="item"><LinkToLessonsBtn /></div>
              </div>
            </ToolbarMenuContext.Provider>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleToolbarWeb;
