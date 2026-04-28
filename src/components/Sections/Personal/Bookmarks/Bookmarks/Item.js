import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { SectionLogo } from '../../../../../helpers/images';
import { iconByContentTypeMap, MY_NAMESPACE_FOLDERS } from '../../../../../helpers/consts';
import { OFFSET_TEXT_SEPARATOR } from '../../../../Pages/WithText/scrollToSearch/helper';
import { getMyItemKey } from '../../../../../helpers/my';
import Link from '../../../../Language/MultiLanguageLink';
import Actions from './Actions';
import { buildTitleByUnit, textPartLink } from '../../../../shared/ContentItem/helper';
import {
  sourcesAreLoadedSelector,
  mdbGetDenormContentUnitSelector,
  myGetItemByKeySelector,
  sourcesGetPathByIDSelector
} from '../../../../../redux/selectors';

const BookmarksItem = ({ bookmark }) => {
  const { t } = useTranslation();
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
    <span key={f.id} className="inline-flex items-center gap-1 rounded border border-gray-300 px-2 py-0.5 small">
      <span className="material-symbols-outlined small margin-left-4 margin-right-4">folder_open</span>
      {f.name}
    </span>
  );

  const title = buildTitleByUnit(cu, t, getPathByID);
  const icon  = iconByContentTypeMap.get(cu?.content_type);

  const citates = [];
  if (properties?.srchstart)
    citates.push(properties.srchstart.split(OFFSET_TEXT_SEPARATOR)[0]);
  if (properties?.srchend)
    citates.push(properties.srchend.split(OFFSET_TEXT_SEPARATOR)[0]);

  return (
    <li className="bookmark_item flex items-start gap-3 border-b py-3">
      <div className="flex-shrink-0">
        <Link to={to}>
          <div className="inline-block align-middle">
            <SectionLogo name={icon} width="25" height="25"/>
          </div>
        </Link>
      </div>
      <Link to={to} className="flex-1 align-bottom">
        <h3 className="display-iblock">
          {name}
          <span className="separator">|</span>
          <span className="source_name">
            {title}
          </span>
        </h3>
        <em className="block text-gray-500">
          {citates.join(' ... ')}
        </em>
        <div>
          {folders.map(renderFolder)}
        </div>
      </Link>
      <div className="flex-shrink-0 self-start">
        <Actions bookmark={bookmark}/>
      </div>
    </li>
  );
};

export default BookmarksItem;
