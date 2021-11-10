import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Segment, Divider, Button, Input, Grid, Icon, Header } from 'semantic-ui-react';

import { actions, selectors } from '../../../../../redux/modules/my';
import { actions as filtersActions, selectors as filtersSelectors } from '../../../../../redux/modules/bookmarkFilter';
import {
  MY_BOOKMARK_FILTER_FOLDER_ID,
  MY_BOOKMARK_FILTER_FOLDER_QUERY,
  MY_NAMESPACE_FOLDERS
} from '../../../../../helpers/consts';

const Container = ({ t }) => {
  const [editFolder, setEditFolder] = useState(false);

  const query = useSelector(state => filtersSelectors.getByKey(state.bookmarkFilter, MY_BOOKMARK_FILTER_FOLDER_QUERY));
  const id    = useSelector(state => filtersSelectors.getByKey(state.bookmarkFilter, MY_BOOKMARK_FILTER_FOLDER_ID));
  const items = useSelector(state => selectors.getList(state.my, MY_NAMESPACE_FOLDERS));

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.fetch(MY_NAMESPACE_FOLDERS, { 'order_by': 'id DESC', query }));
  }, [query]);

  const handleNewFolder = () => {
    setEditFolder(true);
    dispatch(filtersActions.deleteFilter(MY_BOOKMARK_FILTER_FOLDER_QUERY));
  };

  const handleSaveFolder = e => {
    dispatch(actions.add(MY_NAMESPACE_FOLDERS, { name: e.target.value || t('personal.newFolderName') }));
    setEditFolder(false);
  };

  const handleSearchChange = (e, { value }) => dispatch(filtersActions.addFilter(MY_BOOKMARK_FILTER_FOLDER_QUERY, value));

  const handleSelectFolder = id => dispatch(filtersActions.addFilter(MY_BOOKMARK_FILTER_FOLDER_ID, id));

  const renderFolder = f => (
    <Grid.Row
      color={(id === f.id) ? 'blue' : ''}
      key={f.id}
      className="margin-top-4 margin-bottom-4"
    >
      <Grid.Column width="12" onClick={() => handleSelectFolder(f.id)}>
        <Icon name="bookmark outline" />
        {f.name}
      </Grid.Column>
      <Grid.Column width="4">
        <Button icon='edit' />
        <Button icon='delete' />
      </Grid.Column>
    </Grid.Row>
  );

  return (
    <Segment padded>
      <Grid>
        <Grid.Column width="6">
          <Header as="h4" content={t('personal.folders')} />
        </Grid.Column>
        <Grid.Column>
          <Input
            icon
            iconPosition="left"
            placeholder='Search...'
            onChange={handleSearchChange}
            className="no-border"
          >
            <input />
            <Icon name="search" />
          </Input>
        </Grid.Column>
      </Grid>
      {
        editFolder && (
          <Input
            focus
            //onChange={(e, { value }) => setFolderName(value)}
            onBlur={handleSaveFolder}
            autoFocus
            onFocus={e => {
              e.target.value = t('personal.newFolderName');
              e.target.select();
            }}
          />
        )
      }
      <Grid>

        <Grid.Row color={!id ? 'blue' : ''} key="all" className="margin-top-4 margin-bottom-4">
          <Grid.Column width="16" onClick={() => handleSelectFolder(null)}>
            {t('personal.allFolders')}
          </Grid.Column>
        </Grid.Row>
        {
          items.map(renderFolder)
        }
      </Grid>
      <Divider horizontal />

      <Button
        primary
        basic
        content={t('personal.newFolder')}
        onClick={handleNewFolder}
        floated="left"
      />
    </Segment>
  );
};

export default withNamespaces()(withRouter(Container));
