import React, { useContext, useEffect, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Segment, Divider, Button, Input, Grid, Icon, Header, Container } from 'semantic-ui-react';

import { actions, selectors } from '../../../../../redux/modules/my';
import { MY_BOOKMARK_FILTER_FOLDER_ID, MY_NAMESPACE_FOLDERS } from '../../../../../helpers/consts';
import { DeviceInfoContext } from '../../../../../helpers/app-contexts';
import { actions as filtersActions, selectors as filtersSelectors } from '../../../../../redux/modules/bookmarkFilter';
import FolderItem from './Item';
import clsx from 'clsx';

const FolderList = ({ t, close }) => {
  const [editFolder, setEditFolder]         = useState(false);
  const [query, setQuery]                   = useState();
  const [selectedMobile, setSelectedMobile] = useState();

  const { isMobileDevice } = useContext(DeviceInfoContext);

  const items = useSelector(state => selectors.getList(state.my, MY_NAMESPACE_FOLDERS)).filter(x => !query || x.name.toLowerCase().includes(query));

  const dispatch = useDispatch();
  useEffect(() => {
    if (items.length === 0)
      dispatch(actions.fetch(MY_NAMESPACE_FOLDERS, { 'order_by': 'id DESC' }));
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [dispatch]);

  let selectedId = useSelector(state => filtersSelectors.getByKey(state.bookmarkFilter, MY_BOOKMARK_FILTER_FOLDER_ID));
  if (isMobileDevice) selectedId = selectedMobile;

  const selectFolder = id => {
    if (isMobileDevice)
      setSelectedMobile(id);
    else
      dispatch(filtersActions.addFilter(MY_BOOKMARK_FILTER_FOLDER_ID, id));
  };

  const handleClose = () => {
    dispatch(filtersActions.addFilter(MY_BOOKMARK_FILTER_FOLDER_ID, selectedMobile));
    close();
  };

  const newFolder = () => {
    setEditFolder(true);
    setQuery('');
  };

  const saveFolder = e => {
    dispatch(actions.add(MY_NAMESPACE_FOLDERS, { name: e.target.value || t('personal.bookmark.newFolder') }));
    setEditFolder(false);
  };

  const searchChange = (e, { value }) => setQuery(value.toLowerCase());

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      saveFolder(e);
    }
  };

  const renderHeader = () => (
    <Grid verticalAlign="middle" className="folders padded">
      <Grid.Column width="7">
        <Header as="h3" content={t('personal.bookmark.folders')} />
      </Grid.Column>
      <Grid.Column width="9">
        <Input
          icon
          iconPosition="left"
          placeholder={t('personal.bookmark.searchFolders')}
          onChange={searchChange}
          className="bookmark_search"
          defaultValue={query}
        >
          <input />
          <Icon name="search" />
        </Input>
      </Grid.Column>
    </Grid>
  );

  const renderEdit = () => {
    if (!editFolder) return null;

    return (
      <Grid.Row key={'newFolder'}>
        <Grid.Column>
          <Input
            focus
            fluid
            onBlur={saveFolder}
            onKeyDown={handleKeyDown}
            autoFocus
            onFocus={e => {
              e.target.value = t('personal.bookmark.newFolder');
              e.target.select();
            }}
          />
        </Grid.Column>
      </Grid.Row>
    );
  };

  const renderActions = () => (
    <>
      <Button
        primary
        basic
        content={t('personal.bookmark.newFolder')}
        onClick={newFolder}
      />
      {
        isMobileDevice && (
          <Button
            primary
            floated={'right'}
            content={t('buttons.apply')}
            onClick={handleClose}
          />
        )
      }
    </>
  );

  return (
    <Grid.Column mobile={16} tablet={4} computer={4}>
      <Segment basic={isMobileDevice} className={clsx({ 'no-padding': isMobileDevice })}>
        {renderHeader()}
        <Container className="folders_list padded">
          <Grid className="no-padding">
            <FolderItem
              folder={{ id: 'all', name: t('personal.bookmark.allFolders') }}
              key={'all'}
              selectedId={selectedId}
              selectFolder={selectFolder}
            />
            {renderEdit()}
            {
              items.map(f => (
                <FolderItem
                  folder={f}
                  key={f.id}
                  selectedId={selectedId}
                  selectFolder={selectFolder}
                />
              )
              )
            }
          </Grid>
        </Container>
        <Divider />
        {renderActions()}
      </Segment>
    </Grid.Column>
  );
};

export default withNamespaces()(FolderList);
