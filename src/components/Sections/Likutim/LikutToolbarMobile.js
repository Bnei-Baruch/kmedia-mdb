import React from 'react';
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

const LikutToolbarMobile = () => (
  <div className="text_toolbar">
    <div className="text_toolbar__buttons">
      <LanguageTextBtn />
      <TextSettings />
      <SearchOnPageBtn />
      <LessonsByLikutBtn />
      <Popover className="relative text_toolbar__dropdown">
        <Popover.Button as="div">
          <MoreOptionsBtn />
        </Popover.Button>
        <Popover.Panel className="absolute right-0 z-10 bg-white shadow-lg rounded border">
          <div className="px-4 py-2 hover:bg-gray-100">
            <AddBookmarkBtn />
          </div>
          <div className="px-4 py-2 hover:bg-gray-100">
            <DownloadTextBtn />
          </div>
          <div className="px-4 py-2 hover:bg-gray-100">
            <ShareTextModalBtn />
          </div>
          <div className="px-4 py-2 hover:bg-gray-100">
            <CopyLinkBtn />
          </div>
        </Popover.Panel>
      </Popover>
    </div>
  </div>
);

export default LikutToolbarMobile;
