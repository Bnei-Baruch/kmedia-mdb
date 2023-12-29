import React from 'react';
import LanguageTextBtn from '../../../../WithText/Buttons/LanguageTextBtn';
import TextSettings from '../../../../WithText/Buttons/TextSettings/TextSettings';
import BookmarkBtn from '../../../../WithText/Buttons/BookmarkBtn';
import SearchOnPageBtn from '../../../../WithText/Buttons/SearchOnPageBtn';
import DownloadTextBtn from '../../../../WithText/Buttons/DownloadTextBtn';
import ShareTextBtn from '../../../../WithText/Buttons/ShareTextBtn';
import { Dropdown } from 'semantic-ui-react';

const ArticleTabToolbarMobile = () => (
  <div className="text_toolbar is-mobile">
    <div className="text_toolbar__buttons">
      <LanguageTextBtn />
      <TextSettings />
      <SearchOnPageBtn />
      <Dropdown
        item
        icon={null}
        trigger={(<span className="material-symbols-outlined">more_vert</span>)}>
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

export default ArticleTabToolbarMobile;
