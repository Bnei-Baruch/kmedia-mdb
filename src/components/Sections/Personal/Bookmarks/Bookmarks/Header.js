import React, { useContext } from 'react';
import { withNamespaces } from 'react-i18next';
import { Grid, Header, Icon, Input, Label } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  MY_BOOKMARK_FILTER_FOLDER_ID,
  MY_BOOKMARK_FILTER_QUERY,
  MY_NAMESPACE_FOLDERS
} from '../../../../../helpers/consts';
import { actions as filtersActions, selectors as filters } from '../../../../../redux/modules/bookmarkFilter';
import { selectors as my } from '../../../../../redux/modules/my';
import { getMyItemKey } from '../../../../../helpers/my';
import clsx from 'clsx';
import { DeviceInfoContext } from '../../../../../helpers/app-contexts';

const BookmarkHeader = ({ t }) => {
  const query              = useSelector(state => filters.getByKey(state.bookmarkFilter, MY_BOOKMARK_FILTER_QUERY));
  const folder_id          = useSelector(state => filters.getByKey(state.bookmarkFilter, MY_BOOKMARK_FILTER_FOLDER_ID));

  const { key: fKey } = getMyItemKey(MY_NAMESPACE_FOLDERS, { id: folder_id });
  const folder        = useSelector(state => my.getItemByKey(state.my, MY_NAMESPACE_FOLDERS, fKey));

  const dispatch = useDispatch();

  const handleSearch = query => dispatch(filtersActions.addFilter(MY_BOOKMARK_FILTER_QUERY, query.toLowerCase()));

  const placeholder = !folder ? t('personal.bookmark.searchBookmarks') : `${t('personal.bookmark.filterByFolder')}: ${folder.name}`;
  return (
    <Grid className="bookmark_header" verticalAlign="bottom">
      <Grid.Row>
        <Grid.Column width={6}>
          <Header as={'h2'} className="my_header">
            <Icon name="bookmark outline" className="display-iblock" />
            {t('personal.bookmark.title')}
          </Header>
        </Grid.Column>
        <Grid.Column width={10} textAlign={'right'}>
          <Input
            icon="search"
            placeholder={placeholder}
            defaultValue={query}
            autoFocus
            onChange={(e, { value }) => handleSearch(value)}
            className="bookmark_search"
            iconPosition="left"
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default withNamespaces()(BookmarkHeader);
