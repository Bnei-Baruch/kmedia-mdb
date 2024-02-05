import React from 'react';
import { Dropdown } from 'semantic-ui-react';

import TocToggleBtn from './TOC/TocToggleBtn';
import LanguageTextBtn from '../../Pages/WithText/Buttons/LanguageTextBtn';
import TextSettings from '../../Pages/WithText/Buttons/TextSettings/TextSettings';
import SearchOnPageBtn from '../../Pages/WithText/Buttons/SearchOnPageBtn';
import DownloadTextBtn from '../../Pages/WithText/Buttons/DownloadTextBtn';
import LinkToLessonsBtn from '../../Pages/WithText/Buttons/LinkToLessonsBtn';
import BookmarkBtn from '../../Pages/WithText/Buttons/BookmarkBtn';
import ShareTextModalBtn from '../../Pages/WithText/Buttons/ShareTextModalBtn';
import MoreOptionsBtn from '../../Pages/WithText/Buttons/MoreOptionsBtn';

const SourceToolbarMobile = () => (
  <div className="text_toolbar is-mobile">
    <div className="text_toolbar__buttons">
      <TocToggleBtn />
      <LanguageTextBtn />
      <TextSettings />
      <SearchOnPageBtn />
      <Dropdown
        item
        icon={null}
        trigger={<MoreOptionsBtn />}
        pointing="top right"
        className="text_toolbar__dropdown"
      >
        <Dropdown.Menu>
          <Dropdown.Item>
            <BookmarkBtn />
          </Dropdown.Item>
          <Dropdown.Item>
            <LinkToLessonsBtn />
          </Dropdown.Item>
          <Dropdown.Item>
            <DownloadTextBtn />
          </Dropdown.Item>
          <Dropdown.Item>
            <ShareTextModalBtn />
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  </div>
);

export default SourceToolbarMobile;
