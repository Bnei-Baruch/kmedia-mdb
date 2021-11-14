import React from 'react';
import { withNamespaces } from 'react-i18next';
import { Header, Icon, Input, Label } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  MY_BOOKMARK_FILTER_FOLDER_ID,
  MY_BOOKMARK_FILTER_QUERY,
  MY_NAMESPACE_FOLDERS
} from '../../../../../helpers/consts';
import { actions as filtersActions, selectors as filters } from '../../../../../redux/modules/bookmarkFilter';
import { selectors as my } from '../../../../../redux/modules/my';
import { getMyItemKey } from '../../../../../helpers/my';

const BookmarkHeader = ({ t }) => {
  const query         = useSelector(state => filters.getByKey(state.bookmarkFilter, MY_BOOKMARK_FILTER_QUERY));
  const folder_id     = useSelector(state => filters.getByKey(state.bookmarkFilter, MY_BOOKMARK_FILTER_FOLDER_ID));
  const { key: fKey } = getMyItemKey(MY_NAMESPACE_FOLDERS, { id: folder_id });
  const folder        = useSelector(state => my.getItemByKey(state.my, MY_NAMESPACE_FOLDERS, fKey));

  const dispatch = useDispatch();

  const filterList = [];

  if (folder) {
    const name = `${t('personal.filterByFolder')}: ${folder.name}`;
    const key  = MY_BOOKMARK_FILTER_FOLDER_ID;
    filterList.push({ key, name });
  }

  if (query) {
    const name = `${t('personal.filterByQuery')}: ${query}`;
    const key  = MY_BOOKMARK_FILTER_QUERY;
    filterList.push({ key, name });
  }

  const handleRemoveFilter = key => dispatch(filtersActions.deleteFilter(key));

  const handleSearch = query => dispatch(filtersActions.addFilter(MY_BOOKMARK_FILTER_QUERY, query.toLowerCase()));

  const renderLabel = ({ name, key }) => {
    return (
      <Label basic icon className="no-shadow">
        {name}
        <Icon
          name='delete'
          onClick={() => handleRemoveFilter(key)}
        />
      </Label>
    );
  };

  return (
    <Header as={'h2'} className="my_header">
      <Icon name="bookmark outline" className="display-iblock" />
      {t('personal.bookmarks')}
      <Header.Subheader>
        <Input
          icon="search"
          placeholder='Search...'
          defaultValue={query}
          autoFocus
          onChange={(e, { value }) => handleSearch(value)}
        />
        {filterList.map(renderLabel)}
      </Header.Subheader>
    </Header>
  );
};

export default withNamespaces()(BookmarkHeader);
