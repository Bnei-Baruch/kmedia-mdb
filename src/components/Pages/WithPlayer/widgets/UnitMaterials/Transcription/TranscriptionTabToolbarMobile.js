import React from 'react';
import { Dropdown } from 'semantic-ui-react';

import LanguageTextBtn from '../../../../WithText/Buttons/LanguageTextBtn';
import TextSettings from '../../../../WithText/Buttons/TextSettings/TextSettings';
import BookmarkBtn from '../../../../WithText/Buttons/BookmarkBtn';
import SearchOnPageBtn from '../../../../WithText/Buttons/SearchOnPageBtn';
import DownloadTextBtn from '../../../../WithText/Buttons/DownloadTextBtn';
import ShareTextBtn from '../../../../WithText/Buttons/ShareTextBtn';

const TranscriptionTabToolbarMobile = () => (
  <div className="text_toolbar is-mobile">
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
            <DownloadTextBtn />
          </Dropdown.Item>
          <Dropdown.Item>
            <BookmarkBtn />
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  </div>
);

export default TranscriptionTabToolbarMobile;