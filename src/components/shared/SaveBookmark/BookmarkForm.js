import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withTranslation, useTranslation } from 'next-i18next';
import {
  Button,
  Checkbox,
  Container,
  Header,
  Icon,
  Input,
  List,
  Modal,
  ModalActions,
  ModalContent,
  Segment
} from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';

import { selectors } from '../../../../lib/redux/slices/mySlice/mySlice';
import { selectors as textFile } from '../../../../lib/redux/slices/textFileSlice/textFileSlice';
import { MY_NAMESPACE_BOOKMARKS, MY_NAMESPACE_FOLDERS } from '../../../helpers/consts';
import { getMyItemKey } from '../../../helpers/my';
import NeedToLogin from '../../Sections/Personal/NeedToLogin';
import { fetchMy, addMy, editMy } from '../../../../lib/redux/slices/mySlice/thunks';

const BookmarkForm = ({ onClose, bookmarkId }) => {
  const [name, setName]             = useState();
  const [selected, setSelected]     = useState(null);
  const [editFolder, setEditFolder] = useState(false);
  const [query, setQuery]           = useState();
  const [isEdit, setIsEdit]         = useState();

  const { t }    = useTranslation();
  const { key }  = getMyItemKey(MY_NAMESPACE_BOOKMARKS, { id: bookmarkId });
  const source   = useSelector(state => textFile.getBookmarkInfo(state.textFile));
  const bookmark = useSelector(state => selectors.getItemByKey(state.my, MY_NAMESPACE_BOOKMARKS, key));
  const items    = useSelector(state => selectors.getList(state.my, MY_NAMESPACE_FOLDERS)).filter(x => !query || x.name.toLowerCase().includes(query));
  const saved    = items.filter(f => bookmark?.folder_ids?.includes(f.id)).map(f => f.id);

  const dispatch = useDispatch();

  useEffect(() => {
    if (items.length === 0)
      dispatch(fetchMy(MY_NAMESPACE_FOLDERS, { 'order_by': 'id DESC' }));
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (selected === null) {
      setSelected([...saved]);
    }
    //update selected only when saved was changed (that mean only on server response)
    //and not on changes of selected
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [saved?.length]);

  useEffect(() => {
    setName(bookmark?.name);
  }, [bookmark?.name]);

  if (!source && !bookmark)
    return null;

  const needToLogin = NeedToLogin({ t });
  if (needToLogin) {
    return (<Modal.Content>{needToLogin}</Modal.Content>);
  }

  const changeName = (e, { value }) => setName(value);

  const handleSave = () => !bookmark ? create() : update();

  const create = () => {
    const params = { name, ...source, namespace: MY_NAMESPACE_BOOKMARKS };

    if (selected.length > 0)
      params.folder_ids = selected;

    dispatch(addMy(params));
    onClose(null, null, true);
  };

  const update = () => {
    const _params = { namespace: MY_NAMESPACE_BOOKMARKS, id: bookmarkId, name, folder_ids: selected };
    dispatch(editMy(_params));
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
    const _params = { namespace: MY_NAMESPACE_FOLDERS, name: e.target.value || t('personal.bookmark.newFolder') };
    dispatch(addMy(_params));
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
    <React.Fragment>
      <ModalContent className="padded no-padding-top">
        <div>
          <Header as="h4" content={t('personal.bookmark.name')} className="display-iblock font-normal" />
          <Input
            onChange={changeName}
            defaultValue={name}
            error={!name && !isEdit}
            onFocus={e => setIsEdit(true)}
            onBlur={e => setIsEdit(false)}
            className="bookmark_name"
            autoFocus
          />
        </div>
        <Header as="h4" content={t('personal.bookmark.folders')} className="font-normal" />
        <Segment>
          <Input
            icon
            iconPosition="left"
            placeholder={t('personal.bookmark.searchFolders')}
            onChange={handleSearchChange}
            className="bookmark_search"
          >
            <input />
            <Icon name="search" />
          </Input>
          <Container className="folders_list">
            {
              items.map(renderFolder)
            }
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
                    icon="check"
                    basic
                    compact
                    className="no-shadow no-border"
                    onClick={handleSaveFolder}
                  />
                </>
              )
            }
          </Container>
        </Segment>
      </ModalContent>
      {!editFolder &&
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
      }
    </React.Fragment>
  );
};

BookmarkForm.propTypes = {
  bookmarkId: PropTypes.number
};

export default BookmarkForm;
