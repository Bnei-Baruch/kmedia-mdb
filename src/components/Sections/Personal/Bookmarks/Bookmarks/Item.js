import React from 'react';
import { withNamespaces } from 'react-i18next';
import { Image, Label, List } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';

import { selectors as mdb } from '../../../../../redux/modules/mdb';
import { actions, selectors } from '../../../../../redux/modules/my';
import { SectionLogo } from '../../../../../helpers/images';
import Link from '../../../../Language/MultiLanguageLink';
import { canonicalLink } from '../../../../../helpers/links';
import { CT_SOURCE, MY_NAMESPACE_BOOKMARKS, MY_NAMESPACE_FOLDERS } from '../../../../../helpers/consts';
import { getMyItemKey } from '../../../../../helpers/my';
import Actions from './Actions';

const BookmarksItem = ({ bookmark, getSourceById }) => {
  const { id, folder_ids = [] } = bookmark;

  const cu         = useSelector(state => mdb.getDenormContentUnit(state.mdb, bookmark.source_uid));
  const folderKeys = folder_ids.map(id => getMyItemKey(MY_NAMESPACE_FOLDERS, { id }).key);
  const folders    = useSelector(state => folderKeys.map(k => selectors.getItemByKey(state.my, MY_NAMESPACE_FOLDERS, k)).filter(x => !!x));
  const dispatch   = useDispatch();

  const isSource  = cu?.content_type === CT_SOURCE;
  const mdbSource = isSource ? getSourceById(cu.id) : null;
  const link      = canonicalLink(cu);

  const renderFolder = f => (
    <Label
      key={f.id}
      basic
      className="no-border"
      icon="folder outline"
      content={f.name}
    />
  );

  return (
    <List.Item className="padded">
      <List.Icon>
        <Link to={link}>
          <Image size="mini" verticalAlign="middle">
            <SectionLogo name='sources' width='25' height='25' />
          </Image>
        </Link>
      </List.Icon>
      <List.Content>
        <List.Header as="h3">
          {bookmark.name}
          <span className="margin-right-8 margin-left-8">|</span>
          <Link to={link} className="font-normal">
            {isSource ? mdbSource.name : cu?.name}
          </Link>
        </List.Header>
        <List.Description>
          {folders.map(renderFolder)}
        </List.Description>
      </List.Content>
      <List.Icon>
        <Actions id={id} />
      </List.Icon>
    </List.Item>
  );
};

export default withNamespaces()(BookmarksItem);
