import React from 'react';
import { withNamespaces } from 'react-i18next';
import { Image, Label, List } from 'semantic-ui-react';
import { useSelector } from 'react-redux';

import { selectors as mdb } from '../../../../../redux/modules/mdb';
import { selectors } from '../../../../../redux/modules/my';
import { SectionLogo } from '../../../../../helpers/images';
import Link from '../../../../Language/MultiLanguageLink';
import { canonicalLink } from '../../../../../helpers/links';
import {
  iconByContentTypeMap,
  CT_LIKUTIM,
  CT_SOURCE,
  CT_VIDEO_PROGRAM_CHAPTER,
  MY_NAMESPACE_FOLDERS
} from '../../../../../helpers/consts';
import { getMyItemKey } from '../../../../../helpers/my';
import Actions from './Actions';
import { cuPartNameByCCUType } from '../../../../../helpers/utils';
import { stringify } from '../../../../../helpers/url';

const BookmarksItem = ({ bookmark, getPathByID, t }) => {
  const { data, folder_ids = [] } = bookmark;

  const cu         = useSelector(state => mdb.getDenormContentUnit(state.mdb, bookmark.source_uid));
  const folderKeys = folder_ids.map(id => getMyItemKey(MY_NAMESPACE_FOLDERS, { id }).key);
  const folders    = useSelector(state => folderKeys.map(k => selectors.getItemByKey(state.my, MY_NAMESPACE_FOLDERS, k)).filter(x => !!x));

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

  const buildTitle = () => {
    if (!cu) return '';

    const { content_type, film_date, collections, name } = cu;

    if (content_type === CT_SOURCE) {
      const path        = getPathByID(cu.id)?.map(x => x.name);
      const articleName = path.splice(-1);
      return `${articleName} ${path.join('. ')}`;
    }

    if (content_type === CT_LIKUTIM) {
      return name;
    }

    const collection = Object.values(collections)[0];
    const part       = Number(collection?.ccuNames[cu.id]);
    const partName   = t(cuPartNameByCCUType(content_type), { name: part });
    return `${collection.name} ${partName} ${t('values.date', { date: film_date })}`;
  };

  const title = buildTitle();
  const icon  = iconByContentTypeMap.get(cu?.content_type);
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
          {bookmark.name}
          <span className="separator">|</span>
          <span className="source_name">
            {title}
          </span>
        </List.Header>
        <div>
          {`${bookmark.data.srchstart} ... ${bookmark.data.srchend}`}
        </div>
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
