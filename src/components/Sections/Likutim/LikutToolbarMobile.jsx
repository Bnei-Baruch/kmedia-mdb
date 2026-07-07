import { Popover } from '@headlessui/react';

import LanguageTextBtn from '../../Pages/WithText/Buttons/LanguageTextBtn';
import TextSettings from '../../Pages/WithText/Buttons/TextSettings/TextSettings';
import SearchOnPageBtn from '../../Pages/WithText/Buttons/SearchOnPageBtn';
import DownloadTextBtn from '../../Pages/WithText/Buttons/DownloadTextBtn';
import AddBookmarkBtn from '../../Pages/WithText/Buttons/AddBookmarkBtn';
import ShareTextModalBtn from '../../Pages/WithText/Buttons/ShareTextModalBtn';
import LessonsByLikutBtn from './LessonsByLikutBtn';
import MoreOptionsBtn from '../../Pages/WithText/Buttons/MoreOptionsBtn';
import CopyLinkBtn from '../../Pages/WithText/Buttons/CopyLinkBtn';
import { ToolbarMenuContext } from '../../Pages/WithText/Buttons/ToolbarBtnTooltip';

const LikutToolbarMobile = () => (
  <div className="text_toolbar">
    <div className="text_toolbar__buttons">
      <LanguageTextBtn />
      <TextSettings popPos='top' />
      <SearchOnPageBtn />
      <LessonsByLikutBtn />
      <Popover className="text_toolbar__dropdown">
        <Popover.Button as="div">
          <MoreOptionsBtn popPos="top" />
        </Popover.Button>
        <ToolbarMenuContext.Provider value={true}>
          <Popover.Panel className="menu bottom-15! top-auto!">
            <div className="item"><AddBookmarkBtn /></div>
            <div className="item"><DownloadTextBtn /></div>
            <div className="item"><ShareTextModalBtn /></div>
            <div className="item"><CopyLinkBtn /></div>
          </Popover.Panel>
        </ToolbarMenuContext.Provider>
      </Popover>
    </div>
  </div>
);

export default LikutToolbarMobile;
