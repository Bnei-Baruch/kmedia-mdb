import React from 'react';
import { Popover } from '@headlessui/react';

import { ToolbarMenuContext } from '../../Pages/WithText/Buttons/ToolbarBtnTooltip';
import AddCommentBtn from '../../Pages/WithText/Buttons/AddCommentBtn';
import LanguageTextBtn from '../../Pages/WithText/Buttons/LanguageTextBtn';
import TextSettings from '../../Pages/WithText/Buttons/TextSettings/TextSettings';
import AddBookmarkBtn from '../../Pages/WithText/Buttons/AddBookmarkBtn';
import SearchOnPageBtn from '../../Pages/WithText/Buttons/SearchOnPageBtn';
import DownloadTextBtn from '../../Pages/WithText/Buttons/DownloadTextBtn';
import AdditionsModeBtn from '../../Pages/WithText/Buttons/AdditionsMode/AdditionsModeBtn';
import ShareTextBtn from '../../Pages/WithText/Buttons/ShareTextBtn';
import TagTextBtn from '../../Pages/WithText/Buttons/TagTextBtn';
import PrintBtn from '../../Pages/WithText/Buttons/PrintBtn';
import FullscreenTextBtn from '../../Pages/WithText/Buttons/FullscreenTextBtn';
import LessonsByLikutBtn from './LessonsByLikutBtn';
import MoreOptionsBtn from '../../Pages/WithText/Buttons/MoreOptionsBtn';
import CopyLinkBtn from '../../Pages/WithText/Buttons/CopyLinkBtn';

const LikutToolbarWeb = () => (
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
      <LessonsByLikutBtn />
      <FullscreenTextBtn />
      <Popover className="text_toolbar__dropdown xl:hidden">
        <Popover.Button as="div">
          <MoreOptionsBtn />
        </Popover.Button>
        <ToolbarMenuContext.Provider value={true}>
          <Popover.Panel className="menu">
            <div className="item"><DownloadTextBtn /></div>
            <div className="item"><AdditionsModeBtn /></div>
          </Popover.Panel>
        </ToolbarMenuContext.Provider>
      </Popover>
    </div>
  </div>
);

export default LikutToolbarWeb;
