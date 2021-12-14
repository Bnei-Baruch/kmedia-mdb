import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import { actions, selectors } from '../../../../../redux/modules/my';
import { selectors as filters } from '../../../../../redux/modules/bookmarkFilter';
import {
  MY_BOOKMARK_FILTER_FOLDER_ID,
  MY_BOOKMARK_FILTER_QUERY,
  MY_NAMESPACE_BOOKMARKS
} from '../../../../../helpers/consts';
import WipErr from '../../../../shared/WipErr/WipErr';
import NeedToLogin from '../../NeedToLogin';
import { Header, List } from 'semantic-ui-react';
import BookmarksItem from './Item';
import { buildTitleByUnit } from './helper';
import { selectors as mdb } from '../../../../../redux/modules/mdb';
import { selectors as sources } from '../../../../../redux/modules/sources';

const BookmarkList = ({ t }) => {
  let items         = useSelector(state => selectors.getList(state.my, MY_NAMESPACE_BOOKMARKS));
  const wip         = useSelector(state => selectors.getWIP(state.my, MY_NAMESPACE_BOOKMARKS));
  const err         = useSelector(state => selectors.getErr(state.my, MY_NAMESPACE_BOOKMARKS));
  const folder_id   = useSelector(state => filters.getByKey(state.bookmarkFilter, MY_BOOKMARK_FILTER_FOLDER_ID));
  const getPathByID = useSelector(state => sources.getPathByID(state.sources));
  const query       = useSelector(state => filters.getByKey(state.bookmarkFilter, MY_BOOKMARK_FILTER_QUERY));
  const denormCU    = useSelector(state => mdb.nestedGetDenormContentUnit(state.mdb));

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetch(MY_NAMESPACE_BOOKMARKS, { folder_id }));
  }, [folder_id]);

  const needToLogin = NeedToLogin({ t });

  if (needToLogin) return needToLogin;
  const wipErr = WipErr({ wip, err, t });

  if (wipErr) return wipErr;

  const filterBookmarkByQuery = bookmark => {
    if (!bookmark)
      return false;
    const { name, source_uid } = bookmark;

    if (name && name.includes(query))
      return true;
    const cu    = denormCU(source_uid);
    const title = buildTitleByUnit(cu, t, getPathByID);
    return title.includes(query);
  };

  if (items.length === 0) {
    return <Header as="h2" content={t('personal.bookmark.haveNo')} textAlign="center" />;
  }

  if (query) {
    items = items.filter(filterBookmarkByQuery);
  }

  return (
    <List divided relaxed celled>
      {
        items.map(x => <BookmarksItem bookmark={x} key={`${MY_NAMESPACE_BOOKMARKS}_${x.id}`} />)
      }
    </List>
  );
};

export default withNamespaces()(BookmarkList);
