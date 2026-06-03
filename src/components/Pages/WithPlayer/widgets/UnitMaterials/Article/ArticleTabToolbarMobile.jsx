import { useState, useRef } from 'react';

import { useClickOutside } from '../../../../../shared/useClickOutside';
import { ToolbarMenuContext } from '../../../../WithText/Buttons/ToolbarBtnTooltip';
import LanguageTextBtn from '../../../../WithText/Buttons/LanguageTextBtn';
import TextSettings from '../../../../WithText/Buttons/TextSettings/TextSettings';
import SearchOnPageBtn from '../../../../WithText/Buttons/SearchOnPageBtn';
import DownloadTextBtn from '../../../../WithText/Buttons/DownloadTextBtn';
import AddBookmarkBtn from '../../../../WithText/Buttons/AddBookmarkBtn';
import ShareTextModalBtn from '../../../../WithText/Buttons/ShareTextModalBtn';
import MoreOptionsBtn from '../../../../WithText/Buttons/MoreOptionsBtn';
import CopyLinkBtn from '../../../../WithText/Buttons/CopyLinkBtn';
import TocToggleBtn from '../../../../../Sections/Source/TOC/TocToggleBtn';

const ArticleTabToolbarMobile = ({ hasToc }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  useClickOutside(() => setMenuOpen(false), [menuRef]);

  return (
    <div className="text_toolbar">
      <div className="text_toolbar__buttons">
        {hasToc && <TocToggleBtn/>}
        <LanguageTextBtn/>
        <TextSettings/>
        <SearchOnPageBtn/>
        <AddBookmarkBtn/>
        <div className="text_toolbar__dropdown" ref={menuRef}>
          <div onClick={() => setMenuOpen(v => !v)}>
            <MoreOptionsBtn/>
          </div>
          {menuOpen && (
            <ToolbarMenuContext.Provider value={true}>
              <div className="menu">
                <div className="item"><DownloadTextBtn/></div>
                <div className="item"><ShareTextModalBtn/></div>
                <div className="item"><CopyLinkBtn/></div>
              </div>
            </ToolbarMenuContext.Provider>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleTabToolbarMobile;
