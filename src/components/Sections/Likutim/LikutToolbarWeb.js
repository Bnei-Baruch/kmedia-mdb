import React from 'react';
import { Dropdown } from 'semantic-ui-react';

import AddCommentBtn from '../../Pages/WithText/Buttons/AddCommentBtn';
import LanguageTextBtn from '../../Pages/WithText/Buttons/LanguageTextBtn';
import TextSettings from '../../Pages/WithText/Buttons/TextSettings/TextSettings';
import AddBookmarkBtn from '../../Pages/WithText/Buttons/AddBookmarkBtn';
import SearchOnPageBtn from '../../Pages/WithText/Buttons/SearchOnPageBtn';
import DownloadTextBtn from '../../Pages/WithText/Buttons/DownloadTextBtn';
import AdditionsModeBtn from '../../Pages/WithText/Buttons/AdditionsMode/AdditionsModeBtn';
import ShareTextBtn from '../../Pages/WithText/Buttons/ShareTextBtn';
import TagTextBtn from '../../Pages/WithText/Buttons/TagTextBtn';
import PrintBtn from '../../Pages/WithText/Buttons/PrintBtn';
import FullscreenTextBtn from '../../Pages/WithText/Buttons/FullscreenTextBtn';
import LessonsByLikutBtn from './LessonsByLikutBtn';
import MoreOptionsBtn from '../../Pages/WithText/Buttons/MoreOptionsBtn';
import CopyLinkBtn from '../../Pages/WithText/Buttons/CopyLinkBtn';

const LikutToolbarWeb = () => (
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
      <div className="divider computer-only" />
      <LessonsByLikutBtn />
      <FullscreenTextBtn />
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
            <AdditionsModeBtn />
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  </div>
);

export default LikutToolbarWeb;
