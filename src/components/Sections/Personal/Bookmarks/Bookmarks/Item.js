import React from 'react';
import { withNamespaces } from 'react-i18next';
import { Image, Label, List } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';

import { selectors as mdb } from '../../../../../redux/modules/mdb';
import { actions, selectors } from '../../../../../redux/modules/my';
import { SectionLogo } from '../../../../../helpers/images';
import Link from '../../../../Language/MultiLanguageLink';
import { canonicalLink } from '../../../../../helpers/links';
import {
  CT_SOURCE,
  CT_VIDEO_PROGRAM_CHAPTER,
  MY_NAMESPACE_BOOKMARKS,
  MY_NAMESPACE_FOLDERS
} from '../../../../../helpers/consts';
import { getMyItemKey } from '../../../../../helpers/my';
import Actions from './Actions';
import Header from '../../../../Pages/Collection/Header';

const BookmarksItem = ({ bookmark, getSourceById }) => {
  const { id, folder_ids = [] } = bookmark;

  const cu         = useSelector(state => mdb.getDenormContentUnit(state.mdb, bookmark.source_uid));
  const folderKeys = folder_ids.map(id => getMyItemKey(MY_NAMESPACE_FOLDERS, { id }).key);
  const folders    = useSelector(state => folderKeys.map(k => selectors.getItemByKey(state.my, MY_NAMESPACE_FOLDERS, k)).filter(x => !!x));

  const isSource  = cu?.content_type === CT_SOURCE;
  const mdbSource = isSource ? getSourceById(cu.id) : null;
  let link        = canonicalLink(cu);
  if (cu?.content_type === CT_VIDEO_PROGRAM_CHAPTER) {
    link = `${link}?activeTab=transcription`;
  }

  const renderFolder = f => (
    <Label
      key={f.id}
      basic
      icon="folder outline"
      content={f.name}
    />
  );

  return (
    <List.Item className="bookmark_item">
      <List.Icon>
        <Link to={link}>
          <Image size="mini" verticalAlign="middle">
            <SectionLogo name='sources' width='25' height='25' />
          </Image>
        </Link>
      </List.Icon>
      <List.Content as={Link} to={link} verticalAlign="bottom">
        <List.Header as="h3" className="display-iblock">
          {bookmark.name}
          <span className="separator">|</span>
          <span className="source_name">
            {isSource ? mdbSource.name : cu?.name}
          </span>
        </List.Header>
        <List.Description>
          {folders.map(renderFolder)}
        </List.Description>
      </List.Content>
      <List.Icon verticalAlign="top">
        <Actions bookmark={bookmark} />
      </List.Icon>
    </List.Item>
  );
};

export default withNamespaces()(BookmarksItem);
