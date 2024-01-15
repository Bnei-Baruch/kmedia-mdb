import React from 'react';
import { withTranslation } from 'react-i18next';
import { Icon, Image, Label, List } from 'semantic-ui-react';
import { useSelector } from 'react-redux';

import { SectionLogo } from '../../../../../helpers/images';
import { iconByContentTypeMap, MY_NAMESPACE_FOLDERS } from '../../../../../helpers/consts';
import { OFFSET_TEXT_SEPARATOR } from '../../../../../helpers/scrollToSearch/helper';
import { getMyItemKey } from '../../../../../helpers/my';
import Link from '../../../../Language/MultiLanguageLink';
import Actions from './Actions';
import { buildTitleByUnit, textPartLink } from '../../../../shared/ContentItem/helper';
import { sourcesAreLoadedSelector, mdbGetDenormContentUnitSelector, myGetItemByKeySelector, sourcesGetPathByIDSelector } from '../../../../../redux/selectors';

const BookmarksItem = ({ bookmark, t }) => {
  const { properties, folder_ids = [], name, subject_uid } = bookmark;

  const cu               = useSelector(state => mdbGetDenormContentUnitSelector(state, subject_uid));
  const folderKeys       = folder_ids.map(id => getMyItemKey(MY_NAMESPACE_FOLDERS, { id }).key);
  const folders          = useSelector(state => folderKeys.map(k => myGetItemByKeySelector(state, MY_NAMESPACE_FOLDERS, k)).filter(x => !!x));
  const getPathByID      = useSelector(sourcesGetPathByIDSelector);
  const areSourcesLoaded = useSelector(sourcesAreLoadedSelector);

  if (!areSourcesLoaded || !cu)
    return null;

  const to = textPartLink(bookmark?.properties, cu);

  const renderFolder = f => (
    <Label key={f.id} basic>
      <Icon name="folder outline" className="margin-left-4 margin-right-4"/>
      {f.name}
    </Label>
  );

  const title = buildTitleByUnit(cu, t, getPathByID);
  const icon  = iconByContentTypeMap.get(cu?.content_type);

  const citates = [];
  if (!!properties?.srchstart)
    citates.push(properties.srchstart.split(OFFSET_TEXT_SEPARATOR)[0]);
  if (!!properties?.srchend)
    citates.push(properties.srchend.split(OFFSET_TEXT_SEPARATOR)[0]);

  return (
    <List.Item className="bookmark_item">
      <List.Icon>
        <Link to={to}>
          <Image size="mini" verticalAlign="middle">
            <SectionLogo name={icon} width="25" height="25"/>
          </Image>
        </Link>
      </List.Icon>
      <List.Content as={Link} to={to} verticalAlign="bottom">
        <List.Header as="h3" className="display-iblock">
          {name}
          <span className="separator">|</span>
          <span className="source_name">
            {title}
          </span>
        </List.Header>
        <List.Description as={'em'}>
          {citates.join(' ... ')}
        </List.Description>
        <List.Description>
          {folders.map(renderFolder)}
        </List.Description>
      </List.Content>
      <List.Icon verticalAlign="top">
        <Actions bookmark={bookmark}/>
      </List.Icon>
    </List.Item>
  );
};

export default withTranslation()(BookmarksItem);
