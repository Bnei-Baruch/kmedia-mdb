import React from 'react';
import { Dropdown } from 'semantic-ui-react';

import AddCommentBtn from '../../../../WithText/Buttons/AddCommentBtn';
import LanguageTextBtn from '../../../../WithText/Buttons/LanguageTextBtn';
import TextSettings from '../../../../WithText/Buttons/TextSettings/TextSettings';
import AddBookmarkBtn from '../../../../WithText/Buttons/AddBookmarkBtn';
import SearchOnPageBtn from '../../../../WithText/Buttons/SearchOnPageBtn';
import DownloadTextBtn from '../../../../WithText/Buttons/DownloadTextBtn';
import AdditionsModeBtn from '../../../../WithText/Buttons/AdditionsMode/AdditionsModeBtn';
import ShareTextBtn from '../../../../WithText/Buttons/ShareTextBtn';
import TagTextBtn from '../../../../WithText/Buttons/TagTextBtn';
import PrintBtn from '../../../../WithText/Buttons/PrintBtn';
import PlayByTextBtn from '../../../../WithText/Buttons/PlayByTextBtn';
import MoreOptionsBtn from '../../../../WithText/Buttons/MoreOptionsBtn';
import CopyLinkBtn from '../../../../WithText/Buttons/CopyLinkBtn';

const TranscriptionTabToolbarWeb = () => (
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
      <PlayByTextBtn />
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
      <Dropdown
        item
        icon={null}
        trigger={<MoreOptionsBtn />}
        className="text_toolbar__dropdown"
      >
        <Dropdown.Menu>
          <Dropdown.Item>
            <DownloadTextBtn />
          </Dropdown.Item>
          <Dropdown.Item>
            <AdditionsModeBtn />
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  </div>
);

export default TranscriptionTabToolbarWeb;
