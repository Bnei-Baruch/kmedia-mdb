import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import { actions, selectors } from '../../../../../redux/modules/my';
import { selectors as filters } from '../../../../../redux/modules/bookmarkFilter';
import { MY_BOOKMARK_FILTER_FOLDER_ID, MY_NAMESPACE_BOOKMARKS } from '../../../../../helpers/consts';
import WipErr from '../../../../shared/WipErr/WipErr';
import NeedToLogin from '../../NeedToLogin';
import BookmarksList from './List';

const BookmarksContainer = ({ t }) => {
  const items     = useSelector(state => selectors.getList(state.my, MY_NAMESPACE_BOOKMARKS));
  const wip       = useSelector(state => selectors.getWIP(state.my, MY_NAMESPACE_BOOKMARKS));
  const err       = useSelector(state => selectors.getErr(state.my, MY_NAMESPACE_BOOKMARKS));
  const folder_id = useSelector(state => filters.getByKey(state.bookmarkFilter, MY_BOOKMARK_FILTER_FOLDER_ID));

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetch(MY_NAMESPACE_BOOKMARKS, { folder_id }));
  }, [folder_id]);

  const needToLogin = NeedToLogin({ t });
  if (needToLogin) return needToLogin;

  const wipErr = WipErr({ wip, err, t });
  if (wipErr) return wipErr;

  return <BookmarksList items={items} />;
};

export default withNamespaces()(BookmarksContainer);
