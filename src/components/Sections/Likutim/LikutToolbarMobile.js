import React from 'react';
import { Dropdown } from 'semantic-ui-react';

import LanguageTextBtn from '../../Pages/WithText/Buttons/LanguageTextBtn';
import TextSettings from '../../Pages/WithText/Buttons/TextSettings/TextSettings';
import SearchOnPageBtn from '../../Pages/WithText/Buttons/SearchOnPageBtn';
import DownloadTextBtn from '../../Pages/WithText/Buttons/DownloadTextBtn';
import BookmarkBtn from '../../Pages/WithText/Buttons/BookmarkBtn';
import ShareTextModalBtn from '../../Pages/WithText/Buttons/ShareTextModalBtn';
import LessonsByLikutBtn from './LessonsByLikutBtn';
import MoreOptionsBtn from '../../Pages/WithText/Buttons/MoreOptionsBtn';

const LikutToolbarMobile = () => (
  <div className="text_toolbar is-mobile">
    <div className="text_toolbar__buttons">
      <LanguageTextBtn />
      <TextSettings />
      <SearchOnPageBtn />
      <LessonsByLikutBtn />
      <Dropdown
        item
        icon={null}
        trigger={<MoreOptionsBtn />}
        pointing="top right"
        className="text_toolbar__dropdown"
      >
        <Dropdown.Menu>
          <Dropdown.Item>
            <BookmarkBtn />
          </Dropdown.Item>
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

export default LikutToolbarMobile;
