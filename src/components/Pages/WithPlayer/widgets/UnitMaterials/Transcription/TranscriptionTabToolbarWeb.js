import React from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { Dropdown } from 'semantic-ui-react';

import AddCommentBtn from '../../../../WithText/Buttons/AddCommentBtn';
import LanguageTextBtn from '../../../../WithText/Buttons/LanguageTextBtn';
import TextSettings from '../../../../WithText/Buttons/TextSettings/TextSettings';
import AddBookmarkBtn from '../../../../WithText/Buttons/AddBookmarkBtn';
import SearchOnPageBtn from '../../../../WithText/Buttons/SearchOnPageBtn';
import ExpandCommentsBtn from '../../../../WithText/Buttons/ExpandCommentsBtn';
import DownloadTextBtn from '../../../../WithText/Buttons/DownloadTextBtn';
import AdditionsVisibilityBtn from '../../../../WithText/Buttons/AdditionsVisibilityBtn';
import ShareTextBtn from '../../../../WithText/Buttons/ShareTextBtn';
import TagTextBtn from '../../../../WithText/Buttons/TagTextBtn';
import PrintBtn from '../../../../WithText/Buttons/PrintBtn';
import PlayByTextBtn from '../../../../WithText/Buttons/PlayByTextBtn';
import { textPageGetUrlInfoSelector } from '../../../../../../redux/selectors';
import MoreOptionsBtn from '../../../../WithText/Buttons/MoreOptionsBtn';

const TranscriptionTabToolbarWeb = () => {
  const hasNoSel = !useSelector(textPageGetUrlInfoSelector).select;

  return (
    <div className="text_toolbar">
      <div className={clsx('text_toolbar__buttons', { 'text_selected': !hasNoSel })}>
        {
          hasNoSel && (
            <>
              <TextSettings />
              <LanguageTextBtn />
              <div className="divider" />
            </>
          )
        }
        <TagTextBtn />
        <AddBookmarkBtn />
        <AddCommentBtn />
        <ShareTextBtn />
        {
          hasNoSel && (
            <>
              <div className="divider" />
              <SearchOnPageBtn />
              <div className="computer-only">
                <ExpandCommentsBtn />
              </div>
              <div className="computer-only">
                <PrintBtn />
              </div>
              <div className="computer-only">
                <DownloadTextBtn />
              </div>
              <div className="computer-only">
                <AdditionsVisibilityBtn />
              </div>
            </>
          )
        }
        <div className="computer-only">
          <PlayByTextBtn />
        </div>
        <Dropdown
          item
          icon={null}
          trigger={<MoreOptionsBtn />}
          className="text_toolbar__dropdown"
        >
          <Dropdown.Menu>
            <Dropdown.Item>
              <ExpandCommentsBtn />
            </Dropdown.Item>
            <Dropdown.Item>
              <DownloadTextBtn />
            </Dropdown.Item>
            <Dropdown.Item>
              <AdditionsVisibilityBtn />
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default TranscriptionTabToolbarWeb;
