import React from 'react';
import { Dropdown } from 'semantic-ui-react';

import TocToggleBtn from '../../../../../Sections/Source/TOC/TocToggleBtn';
import LanguageTextBtn from '../../../../WithText/Buttons/LanguageTextBtn';
import TextSettings from '../../../../WithText/Buttons/TextSettings/TextSettings';
import SearchOnPageBtn from '../../../../WithText/Buttons/SearchOnPageBtn';
import DownloadTextBtn from '../../../../WithText/Buttons/DownloadTextBtn';
import BookmarkBtn from '../../../../WithText/Buttons/BookmarkBtn';
import ShareTextModalBtn from '../../../../WithText/Buttons/ShareTextModalBtn';
import MoreOptionsBtn from '../../../../WithText/Buttons/MoreOptionsBtn';

const SourceTabToolbarMobile = ({ needTOC }) => (
  <div className="text_toolbar is-mobile">
    <div className="text_toolbar__buttons">
      {needTOC && <TocToggleBtn />}
      <LanguageTextBtn />
      <TextSettings />
      <SearchOnPageBtn />
      <BookmarkBtn />
      <Dropdown
        item
        icon={null}
        trigger={<MoreOptionsBtn />}
        pointing="top right"
        className="text_toolbar__dropdown"
      >
        <Dropdown.Menu>
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

export default SourceTabToolbarMobile;
