import React from 'react';
import { withNamespaces } from 'react-i18next';
import { Image, Label, List } from 'semantic-ui-react';
import { useSelector } from 'react-redux';

import { selectors as mdb } from '../../../../../redux/modules/mdb';
import { selectors } from '../../../../../redux/modules/my';
import { SectionLogo } from '../../../../../helpers/images';
import { canonicalLink } from '../../../../../helpers/links';
import { iconByContentTypeMap, MY_NAMESPACE_FOLDERS } from '../../../../../helpers/consts';
import { OFFSET_TEXT_SEPARATOR } from '../../../../../helpers/scrollToSearch/helper';
import { getMyItemKey } from '../../../../../helpers/my';
import { stringify } from '../../../../../helpers/url';
import Link from '../../../../Language/MultiLanguageLink';
import Actions from './Actions';
import { buildTitleByUnit } from './helper';
import { selectors as sourcesSelectors, selectors as sources } from '../../../../../redux/modules/sources';

const BookmarksItem = ({ bookmark, t }) => {
  const { data, folder_ids = [], name, source_uid } = bookmark;

  const cu               = useSelector(state => mdb.getDenormContentUnit(state.mdb, source_uid));
  const folderKeys       = folder_ids.map(id => getMyItemKey(MY_NAMESPACE_FOLDERS, { id }).key);
  const folders          = useSelector(state => folderKeys.map(k => selectors.getItemByKey(state.my, MY_NAMESPACE_FOLDERS, k)).filter(x => !!x));
  const getPathByID      = useSelector(state => sources.getPathByID(state.sources));
  const areSourcesLoaded = useSelector(state => sourcesSelectors.areSourcesLoaded(state.sources));

  if (!areSourcesLoaded)
    return null;

  let link = canonicalLink(cu);
  if (data) {
    link = `${link}?${stringify(data)}`;
    if (data.activeTab)
      link = `${link}&autoPlay=0`;
  }

  const renderFolder = f => (
    <Label
      key={f.id}
      basic
      icon="folder outline"
      content={f.name}
    />
  );

  const title = buildTitleByUnit(cu, t, getPathByID);
  const icon  = iconByContentTypeMap.get(cu?.content_type);

  const citates = [];
  if (!!data?.srchstart)
    citates.push(data.srchstart.split(OFFSET_TEXT_SEPARATOR)[0]);
  if (!!data?.srchend)
    citates.push(data.srchend.split(OFFSET_TEXT_SEPARATOR)[0]);

  return (
    <List.Item className="bookmark_item">
      <List.Icon>
        <Link to={link}>
          <Image size="mini" verticalAlign="middle">
            <SectionLogo name={icon} width='25' height='25' />
          </Image>
        </Link>
      </List.Icon>
      <List.Content as={Link} to={link} verticalAlign="bottom">
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
        <Actions bookmark={bookmark} />
      </List.Icon>
    </List.Item>
  );
};

export default withNamespaces()(BookmarksItem);
