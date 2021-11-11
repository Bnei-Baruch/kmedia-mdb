import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Segment, Divider, Button, Input, Grid, Icon, Header } from 'semantic-ui-react';

import { actions, selectors } from '../../../../../redux/modules/my';
import { actions as filtersActions, selectors as filtersSelectors } from '../../../../../redux/modules/bookmarkFilter';
import { MY_BOOKMARK_FILTER_FOLDER_QUERY, MY_NAMESPACE_FOLDERS } from '../../../../../helpers/consts';
import FolderItem from './Item';

const Container = ({ t }) => {
  const [editFolder, setEditFolder] = useState(false);

  const query = useSelector(state => filtersSelectors.getByKey(state.bookmarkFilter, MY_BOOKMARK_FILTER_FOLDER_QUERY));
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
      <Grid>
        <FolderItem folder={{ id: 'all', name: t('personal.allFolders') }} />
        {
          editFolder && (
            <Grid.Row>
              <Grid.Column>
                <Input
                  focus
                  fluid
                  onBlur={handleSaveFolder}
                  autoFocus
                  onFocus={e => {
                    e.target.value = t('personal.newFolderName');
                    e.target.select();
                  }}
                />
              </Grid.Column>
            </Grid.Row>
          )
        }
        {
          items.map(f => <FolderItem folder={f} />)
        }
      </Grid>
      <Divider horizontal />
      <Button
        primary
        basic
        content={t('personal.newFolder')}
        onClick={handleNewFolder}
      />
    </Segment>
  );
};

export default withNamespaces()(withRouter(Container));
