import React from 'react';
import { Dropdown } from 'semantic-ui-react';

import AddCommentBtn from '../../../../WithText/Buttons/AddCommentBtn';
import LanguageTextBtn from '../../../../WithText/Buttons/LanguageTextBtn';
import TextSettings from '../../../../WithText/Buttons/TextSettings/TextSettings';
import AddBookmarkBtn from '../../../../WithText/Buttons/AddBookmarkBtn';
import SearchOnPageBtn from '../../../../WithText/Buttons/SearchOnPageBtn';
import DownloadTextBtn from '../../../../WithText/Buttons/DownloadTextBtn';
import AdditionsVisibilityBtn from '../../../../WithText/Buttons/AdditionsVisibilityBtn';
import ShareTextBtn from '../../../../WithText/Buttons/ShareTextBtn';
import TagTextBtn from '../../../../WithText/Buttons/TagTextBtn';
import PrintBtn from '../../../../WithText/Buttons/PrintBtn';
import MoreOptionsBtn from '../../../../WithText/Buttons/MoreOptionsBtn';
import CopyLinkBtn from '../../../../WithText/Buttons/CopyLinkBtn';
import TocToggleBtn from '../../../../../Sections/Source/TOC/TocToggleBtn';

const SourceTabToolbarWeb = ({ hasToc }) => (
  <div className="text_toolbar">
      {hasToc && <TocToggleBtn/>}
    <div className="text_toolbar__buttons">
      <TextSettings/>
      <LanguageTextBtn/>
      <div className="divider"/>
      <TagTextBtn/>
      <AddBookmarkBtn/>
      <AddCommentBtn/>
      <ShareTextBtn/>
      <CopyLinkBtn/>
      <div className="divider"/>
      <SearchOnPageBtn/>
      <div className="computer-only">
        <PrintBtn/>
      </div>
      <div className="computer-only">
        <DownloadTextBtn/>
      </div>
      <div className="computer-only">
        <AdditionsVisibilityBtn/>
      </div>
      <Dropdown
        item
        icon={null}
        trigger={<MoreOptionsBtn/>}
        className="text_toolbar__dropdown"
      >
        <Dropdown.Menu>
          <Dropdown.Item>
            <DownloadTextBtn/>
          </Dropdown.Item>
          <Dropdown.Item>
            <AdditionsVisibilityBtn/>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  </div>
);

export default SourceTabToolbarWeb;
