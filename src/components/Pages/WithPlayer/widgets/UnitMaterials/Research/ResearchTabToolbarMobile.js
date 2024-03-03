import React from 'react';
import { Dropdown } from 'semantic-ui-react';

import LanguageTextBtn from '../../../../WithText/Buttons/LanguageTextBtn';
import TextSettings from '../../../../WithText/Buttons/TextSettings/TextSettings';
import SearchOnPageBtn from '../../../../WithText/Buttons/SearchOnPageBtn';
import DownloadTextBtn from '../../../../WithText/Buttons/DownloadTextBtn';
import AddBookmarkBtn from '../../../../WithText/Buttons/AddBookmarkBtn';
import ShareTextModalBtn from '../../../../WithText/Buttons/ShareTextModalBtn';
import MoreOptionsBtn from '../../../../WithText/Buttons/MoreOptionsBtn';
import CopyLinkBtn from '../../../../WithText/Buttons/CopyLinkBtn';

const ResearchTabToolbarMobile = () => {
  return (
    <div className="text_toolbar">
      <div className="text_toolbar__buttons">
        <LanguageTextBtn />
        <TextSettings />
        <SearchOnPageBtn />
        <AddBookmarkBtn />
        <Dropdown
          item
          icon={null}
          trigger={<MoreOptionsBtn />}
          className="text_toolbar__dropdown"
          direction="left"
        >
          <Dropdown.Menu>
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

export default ResearchTabToolbarMobile;
