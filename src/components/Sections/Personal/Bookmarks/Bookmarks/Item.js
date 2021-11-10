import React, { useCallback, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import { Dropdown, Icon, Image, Label, List } from 'semantic-ui-react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

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

  const handleRemoveFolder = fID => {
    dispatch(actions.edit(MY_NAMESPACE_BOOKMARKS, { id, folder_ids: folder_ids.filter(x => x !== fID) }));
  };

  const renderFolder = f => {
    return (
      <Label as="a">
        <Icon name="folder outline" />
        {f.name}
        <Icon name="delete" onClick={() => handleRemoveFolder(f.id)} />
      </Label>
    );
  };

  return (
    <List.Item className="padded" key={id}>
      <List.Icon>
        <Link to={{ pathname: canonicalLink(cu) }}>
          <Image size="mini" verticalAlign="middle">
            <SectionLogo name='sources' width='25' height='25' />
          </Image>
        </Link>
      </List.Icon>
      <List.Content>
        <List.Header>
          {`${bookmark.name} | ${isSource ? mdbSource.name : cu?.name}`}
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
