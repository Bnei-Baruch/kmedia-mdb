import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import {
  Button,
  Checkbox, Container,
  Header,
  Icon,
  Input,
  List, Modal,
  ModalActions,
  ModalContent,
  Segment
} from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';

import { actions, selectors } from '../../../redux/modules/my';
import { MY_NAMESPACE_BOOKMARKS, MY_NAMESPACE_FOLDERS } from '../../../helpers/consts';
import { frownSplashNotFound } from '../WipErr/WipErr';
import { getMyItemKey } from '../../../helpers/my';
import NeedToLogin from '../../Sections/Personal/NeedToLogin';

const BookmarkForm = ({ t, onClose, source, bookmarkId, data }) => {
  const [name, setName] = useState();
  const [selected, setSelected] = useState(null);
  const [editFolder, setEditFolder] = useState(false);
  const [query, setQuery] = useState();

  const { key } = getMyItemKey(MY_NAMESPACE_BOOKMARKS, { id: bookmarkId });
  const bookmark = useSelector(state => selectors.getItemByKey(state.my, MY_NAMESPACE_BOOKMARKS, key));
  const items = useSelector(state => selectors.getList(state.my, MY_NAMESPACE_FOLDERS)).filter(x => !query || x.name.toLowerCase().includes(query));
  const saved = items.filter(f => bookmark?.folder_ids?.includes(f.id)).map(f => f.id);

  const dispatch = useDispatch();

  useEffect(() => {
    if (items.length === 0)
      dispatch(actions.fetch(MY_NAMESPACE_FOLDERS, { 'order_by': 'id DESC' }));
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (selected === null) {
      setSelected([...saved]);
    }
    // eslint-disable-next-line  react-hooks/exhaustive-deps

  }, [saved?.length]);

  useEffect(() => {
    setName(bookmark?.name);
  }, [bookmark?.name]);

  if (!source && !bookmark)
    return null;

  const needToLogin = NeedToLogin({ t });
  if (needToLogin) {
    return (<Modal.Content>{needToLogin}</Modal.Content>)
  }

  const changeName = (e, { value }) => setName(value);

  const handleSave = () => !bookmark ? create() : update();

  const create = () => {
    const params = { name, ...source };

    if (selected.length > 0)
      params.folder_ids = selected;

    dispatch(actions.add(MY_NAMESPACE_BOOKMARKS, params));
    onClose(null, null, true);
  };

  const update = () => {
    dispatch(actions.edit(MY_NAMESPACE_BOOKMARKS, { id: bookmarkId, name, folder_ids: selected }));
    onClose(null, null, true);
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

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      handleSaveFolder(e);
    }
  };

  const handleSaveFolder = e => {
    dispatch(actions.add(MY_NAMESPACE_FOLDERS, { name: e.target.value || t('personal.bookmark.newFolder') }));
    setEditFolder(false);
  };

  const handleSearchChange = (e, { value }) => setQuery(value.toLowerCase());

  const renderFolder = f => (
    <List.Item key={f.id}>
      <Checkbox
        checked={selected?.includes(f.id)}
        onChange={(e, { checked }) => handleChange(checked, f.id)}
        label={f.name}
      />
    </List.Item>
  );

  return (
    <>
      <ModalContent className="padded">
        <div>
          <Header as="h4" content={t('personal.bookmark.name')} className="display-iblock"/>
          <Input
            focus={true}
            onChange={changeName}
            defaultValue={name}
            error={!name}
            className="margin-left-8 margin-right-8"
            style={{ width: '70%' }}
          />
        </div>
        <Header as="h3" content={t('personal.bookmark.folders')}/>
        <Segment>
          <Input
            icon
            iconPosition="left"
            placeholder={t('personal.bookmark.searchFolders')}
            onChange={handleSearchChange}
            className="bookmark_search"
          >
            <input/>
            <Icon name="search"/>
          </Input>
          <Container className="folders_list">
            {
              editFolder && (
                <>
                  <Input
                    focus
                    onBlur={handleSaveFolder}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    onFocus={e => {
                      e.target.value = t('personal.bookmark.newFolder');
                      e.target.select();
                    }}
                  />
                  <Button
                    icon='check'
                    basic
                    compact
                    className="no-shadow"
                    onClick={handleSaveFolder}
                    floated="right"
                  />
                </>
              )
            }
            {
              !(items.length === 0 && editFolder) ?
                items.map(renderFolder)
                : frownSplashNotFound(t)
            }
          </Container>
        </Segment>
      </ModalContent>
      <ModalActions>
        <Button
          primary
          basic
          content={t('personal.bookmark.newFolder')}
          onClick={handleNewFolder}
          floated="left"
          disabled={editFolder}
        />
        <Button
          content={t('buttons.cancel')}
          onClick={onClose}
          color="grey"
          disabled={editFolder}
          className="margin-left-8 margin-right-8"
        />
        <Button
          primary
          content={t('buttons.save')}
          onClick={handleSave}
          floated="right"
          disabled={!name || editFolder}
        />
      </ModalActions>
    </>
  );
};

BookmarkForm.propTypes = {
  t: PropTypes.func.isRequired,
  source: PropTypes.object,
  bookmarkId: PropTypes.number
};

export default withNamespaces()(BookmarkForm);
