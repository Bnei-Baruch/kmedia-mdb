import React from 'react';
import { Popover } from '@headlessui/react';

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
      <div className="computer-only">
        <PrintBtn />
      </div>
      <div className="computer-only">
        <DownloadTextBtn />
      </div>
      <div className="computer-only">
        <AdditionsModeBtn />
      </div>
      <div className="divider computer-only" />
      <LessonsByLikutBtn />
      <FullscreenTextBtn />
      <Popover className="relative text_toolbar__dropdown">
        <Popover.Button as="div">
          <MoreOptionsBtn />
        </Popover.Button>
        <Popover.Panel className="absolute right-0 z-10 bg-white shadow-lg rounded border">
          <div className="px-4 py-2 hover:bg-gray-100">
            <DownloadTextBtn />
          </div>
          <div className="px-4 py-2 hover:bg-gray-100">
            <AdditionsModeBtn />
          </div>
        </Popover.Panel>
      </Popover>
    </div>
  </div>
);

export default LikutToolbarWeb;
