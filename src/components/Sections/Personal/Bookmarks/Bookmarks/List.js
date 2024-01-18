import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { actions } from '../../../../../redux/modules/my';
import {
  MY_BOOKMARK_FILTER_FOLDER_ID,
  MY_BOOKMARK_FILTER_QUERY,
  MY_NAMESPACE_BOOKMARKS
} from '../../../../../helpers/consts';
import WipErr from '../../../../shared/WipErr/WipErr';
import NeedToLogin from '../../NeedToLogin';
import { Header, List } from 'semantic-ui-react';
import BookmarksItem from './Item';
import { buildTitleByUnit } from '../../../../shared/ContentItem/helper';
import { bookmarkFilterGetByKeySelector, myGetListSelector, myGetErrSelector, myGetWipSelector, sourcesGetPathByIDSelector, settingsGetUILangSelector, mdbNestedGetDenormContentUnitSelector } from '../../../../../redux/selectors';

const BookmarkList = ({ t }) => {
  let items         = useSelector(state => myGetListSelector(state, MY_NAMESPACE_BOOKMARKS));
  const wip         = useSelector(state => myGetWipSelector(state, MY_NAMESPACE_BOOKMARKS));
  const err         = useSelector(state => myGetErrSelector(state, MY_NAMESPACE_BOOKMARKS));
  const folder_id   = useSelector(state => bookmarkFilterGetByKeySelector(state, MY_BOOKMARK_FILTER_FOLDER_ID));
  const getPathByID = useSelector(sourcesGetPathByIDSelector);
  const query       = useSelector(state => bookmarkFilterGetByKeySelector(state, MY_BOOKMARK_FILTER_QUERY));
  const denormCU    = useSelector(mdbNestedGetDenormContentUnitSelector);
  const uiLang      = useSelector(settingsGetUILangSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetch(MY_NAMESPACE_BOOKMARKS, { folder_id }));
  }, [folder_id, uiLang, dispatch]);

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

  if (items.length === 0 && !folder_id) {
    return <Header as="h2" content={t('personal.bookmark.haveNo')} textAlign="center"/>;
  }

  if (query) {
    items = items.filter(filterBookmarkByQuery);
  }

  return (
    <List divided relaxed celled>
      {
        items.map(x => <BookmarksItem bookmark={x} key={`${MY_NAMESPACE_BOOKMARKS}_${x.id}`}/>)
      }
    </List>
  );
};

export default withTranslation()(BookmarkList);
