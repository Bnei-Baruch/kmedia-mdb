import React, { useContext, useEffect, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Segment, Divider, Button, Input, Grid, Icon, Header, Container } from 'semantic-ui-react';

import { actions, selectors } from '../../../../../redux/modules/my';
import { MY_NAMESPACE_FOLDERS } from '../../../../../helpers/consts';
import FolderItem from './Item';
import { DeviceInfoContext } from '../../../../../helpers/app-contexts';

const FolderList = ({ t, close }) => {
  const [editFolder, setEditFolder] = useState(false);
  const [query, setQuery]           = useState();

  const items = useSelector(state => selectors.getList(state.my, MY_NAMESPACE_FOLDERS)).filter(x => !query || x.name.toLowerCase().includes(query));

  const { isMobileDevice } = useContext(DeviceInfoContext);

  const dispatch = useDispatch();
  useEffect(() => {
    if (items.length === 0)
      dispatch(actions.fetch(MY_NAMESPACE_FOLDERS, { 'order_by': 'id DESC' }));
  }, []);

  const handleNewFolder = () => {
    setEditFolder(true);
    setQuery('');
  };

  const handleSaveFolder = e => {
    dispatch(actions.add(MY_NAMESPACE_FOLDERS, { name: e.target.value || t('personal.bookmark.newFolderName') }));
    setEditFolder(false);
  };

  const handleSearchChange = (e, { value }) => setQuery(value.toLowerCase());

  return (
    <Grid.Column mobile={16} tablet={4} computer={4}>
      <Segment className="bookmark_page">
        <Grid verticalAlign="middle" className="folders padded">
          <Grid.Column width="7">
            <Header as="h3" content={t('personal.bookmark.folders')} />
          </Grid.Column>
          <Grid.Column width="9">
            <Input
              icon
              iconPosition="left"
              placeholder={t('personal.bookmark.searchFolders')}
              onChange={handleSearchChange}
              className="bookmark_search"
              defaultValue={query}
            >
              <input />
              <Icon name="search" />
            </Input>
          </Grid.Column>
        </Grid>
        <Container className="folders_list padded">
          <Grid className="no-padding">
            <FolderItem folder={{ id: 'all', name: t('personal.bookmark.allFolders') }} />
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
                        e.target.value = t('personal.bookmark.newFolderName');
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
        </Container>
        <Divider horizontal />
        <Button
          primary
          basic
          content={t('personal.bookmark.newFolder')}
          onClick={handleNewFolder}
        />
        {
          isMobileDevice && (
            <Button
              primary
              basic
              floated={'right'}
              content={t('buttons.apply')}
              onClick={close}
            />
          )
        }
      </Segment>
    </Grid.Column>
  );
};

export default withNamespaces()(FolderList);
