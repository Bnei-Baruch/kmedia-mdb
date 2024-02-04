import React from 'react';
import LanguageTextBtn from '../../../../Pages/WithText/Buttons/LanguageTextBtn';
import TextSettings from '../../../../Pages/WithText/Buttons/TextSettings/TextSettings';
import BookmarkBtn from '../../../../Pages/WithText/Buttons/BookmarkBtn';
import SearchOnPageBtn from '../../../../Pages/WithText/Buttons/SearchOnPageBtn';
import DownloadTextBtn from '../../../../Pages/WithText/Buttons/DownloadTextBtn';
import ShareTextBtn from '../../../../Pages/WithText/Buttons/ShareTextBtn';
import { Dropdown } from 'semantic-ui-react';

const ArticleToolbarMobile = () => (
  <div className="text_toolbar is-mobile">
    <div className="text_toolbar__buttons">
      <LanguageTextBtn />
      <TextSettings />
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
            <BookmarkBtn />
          </Dropdown.Item>
          <Dropdown.Item>
            <ShareTextBtn />
          </Dropdown.Item>
          <Dropdown.Item>
            <DownloadTextBtn />
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  </div>
);

export default ArticleToolbarMobile;
