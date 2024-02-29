import React from 'react';
import { withTranslation } from 'react-i18next';
import { Grid, Header, Icon, Input } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';

import { actions as filtersActions } from '../../../../redux/modules/bookmarkFilter';
import {
  MY_BOOKMARK_FILTER_FOLDER_ID,
  MY_BOOKMARK_FILTER_QUERY,
  MY_NAMESPACE_FOLDERS
} from '../../../../helpers/consts';
import { getMyItemKey } from '../../../../helpers/my';
import { bookmarkFilterGetByKeySelector, myGetItemByKeySelector } from '../../../../redux/selectors';

const BookmarkHeader = ({ t }) => {
  const query     = useSelector(state => bookmarkFilterGetByKeySelector(state, MY_BOOKMARK_FILTER_QUERY));
  const folder_id = useSelector(state => bookmarkFilterGetByKeySelector(state, MY_BOOKMARK_FILTER_FOLDER_ID));

  const { key: fKey } = getMyItemKey(MY_NAMESPACE_FOLDERS, { id: folder_id });
  const folder        = useSelector(state => myGetItemByKeySelector(state, MY_NAMESPACE_FOLDERS, fKey));

  const dispatch = useDispatch();

  const handleSearch = query => dispatch(filtersActions.addFilter(MY_BOOKMARK_FILTER_QUERY, query));

  const placeholder = !folder ? t('personal.bookmark.searchBookmarks') : `${t('personal.bookmark.filterByFolder')}: ${folder.name}`;
  return (
    <Grid.Row verticalAlign="bottom">
      <Grid.Column mobile={16} tablet={4} computer={4}/>
      <Grid.Column mobile={16} tablet={5} computer={5}>
        <Header as={'h2'} className="my_header">
          <Icon name="bookmark outline" className="display-iblock"/>
          {t('personal.bookmark.title')}
        </Header>
      </Grid.Column>

      <Grid.Column mobile={16} tablet={7} computer={7} textAlign={'right'}>
        <Input
          icon="search"
          placeholder={placeholder}
          defaultValue={query}
          onChange={(e, { value }) => handleSearch(value)}
          className="bookmark_search"
          iconPosition="left"
        />
      </Grid.Column>
    </Grid.Row>
  );
};

export default withTranslation()(BookmarkHeader);
