import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import { actions, selectors } from '../../../../../redux/modules/my';
import { selectors as sources } from '../../../../../redux/modules/sources';
import { selectors as filters } from '../../../../../redux/modules/bookmarkFilter';
import {
  MY_BOOKMARK_FILTER_FOLDER_ID,
  MY_BOOKMARK_FILTER_QUERY,
  MY_NAMESPACE_BOOKMARKS
} from '../../../../../helpers/consts';
import WipErr from '../../../../shared/WipErr/WipErr';
import NeedToLogin from '../../NeedToLogin';
import { List } from 'semantic-ui-react';
import BookmarksItem from './Item';

const BookmarkList = ({ t }) => {
  const items       = useSelector(state => selectors.getList(state.my, MY_NAMESPACE_BOOKMARKS));
  const wip         = useSelector(state => selectors.getWIP(state.my, MY_NAMESPACE_BOOKMARKS));
  const err         = useSelector(state => selectors.getErr(state.my, MY_NAMESPACE_BOOKMARKS));
  const folder_id   = useSelector(state => filters.getByKey(state.bookmarkFilter, MY_BOOKMARK_FILTER_FOLDER_ID));
  const query       = useSelector(state => filters.getByKey(state.bookmarkFilter, MY_BOOKMARK_FILTER_QUERY));
  const getPathByID = useSelector(state => sources.getPathByID(state.sources));

  const dispatch = useDispatch();

  const params = { folder_id, query };

  useEffect(() => {
    dispatch(actions.fetch(MY_NAMESPACE_BOOKMARKS, params));
  }, [folder_id]);

  useEffect(() => {
    dispatch(actions.fetch(MY_NAMESPACE_BOOKMARKS, params));
  }, [query]);

  const needToLogin = NeedToLogin({ t });
  if (needToLogin) return needToLogin;

  const wipErr = WipErr({ wip, err, t });
  if (wipErr) return wipErr;

  return (
    <List divided relaxed celled>
      {
        items.map(x => <BookmarksItem
          bookmark={x}
          getPathByID={getPathByID}
          key={`${MY_NAMESPACE_BOOKMARKS}_${x.id}`}
        />
        )
      }
    </List>
  );
};

export default withNamespaces()(BookmarkList);
