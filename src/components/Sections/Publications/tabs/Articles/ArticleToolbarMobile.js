import React from 'react';
import { Dropdown } from 'semantic-ui-react';

import LanguageTextBtn from '../../../../Pages/WithText/Buttons/LanguageTextBtn';
import TextSettings from '../../../../Pages/WithText/Buttons/TextSettings/TextSettings';
import AddBookmarkBtn from '../../../../Pages/WithText/Buttons/AddBookmarkBtn';
import SearchOnPageBtn from '../../../../Pages/WithText/Buttons/SearchOnPageBtn';
import DownloadTextBtn from '../../../../Pages/WithText/Buttons/DownloadTextBtn';
import ShareTextBtn from '../../../../Pages/WithText/Buttons/ShareTextBtn';
import MoreOptionsBtn from '../../../../Pages/WithText/Buttons/MoreOptionsBtn';

const ArticleToolbarMobile = () => (
  <div className="text_toolbar is-mobile">
    <div className="text_toolbar__buttons">
      <LanguageTextBtn />
      <TextSettings />
      <SearchOnPageBtn />
      <AddBookmarkBtn />
      <Dropdown
        item
        icon={null}
        trigger={<MoreOptionsBtn />}
        pointing="top right"
        className="text_toolbar__dropdown"
      >
        <Dropdown.Menu>
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
