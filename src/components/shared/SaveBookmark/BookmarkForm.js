import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import {
  Button,
  Checkbox,
  Grid,
  Header,
  Icon,
  Input,
  List,
  ModalActions,
  ModalContent,
  Segment
} from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';

import { actions, selectors } from '../../../redux/modules/my';
import { MY_NAMESPACE_BOOKMARKS, MY_NAMESPACE_FOLDERS } from '../../../helpers/consts';
import { frownSplashNotFound } from '../WipErr/WipErr';
import { getMyItemKey } from '../../../helpers/my';

const BookmarkForm = ({ t, onClose, source, bookmarkId }) => {
  const [name, setName]             = useState();
  const [selected, setSelected]     = useState(null);
  const [editFolder, setEditFolder] = useState(false);

  const { key }  = getMyItemKey(MY_NAMESPACE_BOOKMARKS, { id: bookmarkId });
  const bookmark = useSelector(state => selectors.getItemByKey(state.my, MY_NAMESPACE_BOOKMARKS, key));
  const items    = useSelector(state => selectors.getList(state.my, MY_NAMESPACE_FOLDERS)).sort((a, b) => b.id - a.id);
  const saved    = items.filter(f => bookmark?.folder_ids?.includes(f.id)).map(f => f.id);
  const dispatch = useDispatch();

  useEffect(() => {
    if (items.length === 0)
      dispatch(actions.fetch(MY_NAMESPACE_FOLDERS, { 'order_by': 'id DESC' }));
    setName(bookmark?.name || '');
  }, []);

  useEffect(() => {
    if (selected === null)
      setSelected([...saved]);
  }, [items?.length]);

  if (!source && !bookmark)
    return null;

  const changeName = (e, { value }) => setName(value);

  const handleSave = () => !bookmark ? create() : update();

  const create = () => {
    const params = { name, ...source };

    if (selected.length > 0)
      params.folder_ids = selected;

    dispatch(actions.add(MY_NAMESPACE_BOOKMARKS, params));
    onClose();
  };

  const update = () => {
    dispatch(actions.edit(MY_NAMESPACE_BOOKMARKS, { id: bookmarkId, name, folder_ids: selected }));
    onClose();
  };

  const handleChange = (checked, id) => {
    if (checked) {
      setSelected([id, ...selected || []]);
    } else {
      setSelected(selected.filter(x => x !== id));
    }
  };

  const handleNewFolder = () => {
    setEditFolder(true);
    handleSearchChange(null, { value: '' });
  };

  const handleSaveFolder = e => {
    dispatch(actions.add(MY_NAMESPACE_FOLDERS, { name: e.target.value }));
    setEditFolder(false);
  };

  const handleSearchChange = (e, { value }) => {
    const params = { 'order_by': 'id DESC' };
    if (value.length > 0) {
      params.query = value.toLowerCase();
    }

    dispatch(actions.fetch(MY_NAMESPACE_FOLDERS, params));
  };

  const renderFolder = f => (
    <List.Item key={f.id} className="margin-top-8 margin-bottom-4">
      <Checkbox
        checked={selected?.includes(f.id)}
        onChange={(e, { checked }) => handleChange(checked, f.id)}
        label={f.name}
        className="margin-right-4 margin-left-4"
      />
    </List.Item>
  );

  return (
    <>
      <ModalContent className="padded">
        <Grid>
          <Grid.Column key={1} width="2">
            {t('personal.name')}
          </Grid.Column>
          <Grid.Column key={2} width="14">
            <Input
              fluid
              focus={true}
              onChange={changeName}
              autoFocus
            />
          </Grid.Column>
        </Grid>
        <Header as="h4" content={t('personal.folders')} />
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
      </ModalContent>
      <ModalContent className="padded" scrolling>
        <Segment padded>
          {
            editFolder && (
              <Input
                focus
                onBlur={handleSaveFolder}
                autoFocus
                onFocus={e => {
                  e.target.value = t('personal.newFolderName');
                  e.target.select();
                }}
              />
            )
          }
          {
            !(items.length === 0 && editFolder) ?
              items.map(renderFolder)
              : frownSplashNotFound(t)
          }
        </Segment>
      </ModalContent>
      <ModalActions>
        <Button
          primary
          basic
          content={t('personal.newFolder')}
          onClick={handleNewFolder}
          floated="left"
        />
        <Button
          content={t('buttons.cancel')}
          onClick={onClose}
          color="grey"
        />
        <Button
          primary
          content={t('buttons.save')}
          onClick={handleSave}
          floated="right"
        />
      </ModalActions>
    </>
  );
};

BookmarkForm.propTypes = {
  t: PropTypes.func.isRequired,
  source: PropTypes.object.isRequired,
};

export default withNamespaces()(BookmarkForm);
