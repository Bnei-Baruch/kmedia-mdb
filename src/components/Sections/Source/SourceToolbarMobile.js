import React from 'react';
import TocToggleBtn from './TOC/TocToggleBtn';
import LanguageTextBtn from '../../Pages/WithText/Buttons/LanguageTextBtn';
import TextSettings from '../../Pages/WithText/Buttons/TextSettings/TextSettings';
import BookmarkBtn from '../../Pages/WithText/Buttons/BookmarkBtn';
import SearchOnPageBtn from '../../Pages/WithText/Buttons/SearchOnPageBtn';
import DownloadTextBtn from '../../Pages/WithText/Buttons/DownloadTextBtn';
import ShareTextBtn from '../../Pages/WithText/Buttons/ShareTextBtn';
import { Dropdown } from 'semantic-ui-react';
import LinkToLessonsBtn from '../../Pages/WithText/Buttons/LinkToLessonsBtn';

const SourceToolbarMobile = () => (
  <div className="text_toolbar is-mobile">
    <TocToggleBtn />
    <div className="text_toolbar__buttons">
      <LanguageTextBtn />
      <TextSettings />
      <div className="divider" />
      <ShareTextBtn />
      <div className="divider" />
      <SearchOnPageBtn />
      <Dropdown
        item
        icon={null}
        trigger={(<span className="material-symbols-outlined">more_vert</span>)}
        pointing="top right"
        className="text_toolbar__dropdown"
      >
        <Dropdown.Menu>
          <Dropdown.Item>
            <LinkToLessonsBtn />
          </Dropdown.Item>
          <Dropdown.Item>
            <DownloadTextBtn />
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  </div>
);

export default SourceToolbarMobile;
