import React from 'react';
import { Dropdown } from 'semantic-ui-react';

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
  return (
    <div className="text_toolbar">
      <div className="text_toolbar__buttons">
        <TocToggleBtn />
        <LanguageTextBtn />
        <TextSettings />
        <SearchOnPageBtn />
        <Dropdown
          item
          icon={null}
          trigger={<MoreOptionsBtn />}
          className="text_toolbar__dropdown"
          direction="left"
        >
          <Dropdown.Menu>
            <Dropdown.Item>
              <AddBookmarkBtn />
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
            <Dropdown.Item>
              <CopyLinkBtn />
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default SourceToolbarMobile;
