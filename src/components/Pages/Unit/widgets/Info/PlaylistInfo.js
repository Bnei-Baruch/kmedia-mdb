import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';
import { Button, Checkbox, Icon, Input, List, Modal, Divider } from 'semantic-ui-react';

import { actions, selectors } from '../../../../../redux/modules/my';
import { selectors as auth } from '../../../../../redux/modules/auth';
import { selectors as settings } from '../../../../../redux/modules/settings';
import { MY_NAMESPACE_PLAYLIST_ITEMS, MY_NAMESPACE_PLAYLISTS } from '../../../../../helpers/consts';
import { getLanguageDirection } from '../../../../../helpers/i18n-utils';
import AlertModal from '../../../../shared/AlertModal';
import PlaylistAddIcon from '../../../../../images/icons/PlaylistAdd';
import NeedToLogin from '../../../../Sections/Personal/NeedToLogin';

const PlaylistInfo = ({ cuID, t, handleClose = null }) => {
  const [isOpen, setIsOpen]               = useState(false);
  const [alertMsg, setAlertMsg]           = useState();
  const [isNeedLogin, setIsNeedLogin]     = useState();
  const [selected, setSelected]           = useState([]);
  const [newPlaylist, setNewPlaylist]     = useState('');
  const [isNewPlaylist, setIsNewPlaylist] = useState(false);
  const [countNew, setCountNew]           = useState(0);

  const dispatch = useDispatch();

  const playlists = useSelector(state => selectors.getList(state.my, MY_NAMESPACE_PLAYLISTS));
  const language  = useSelector(state => settings.getLanguage(state.settings));
  const user      = useSelector(state => auth.getUser(state.auth));
  const saved     = playlists.filter(p => !!p.items);

  useEffect(() => {
    playlists.sort((a, b) => b.id - a.id);
    const s = playlists.slice(0, countNew);
    setSelected([...s, ...saved]);
  }, [playlists.length, cuID]);

  const dir = getLanguageDirection(language);

  const onOpen = () => {
    dispatch(actions.fetch(MY_NAMESPACE_PLAYLISTS, { 'exist_cu': cuID, order_by: 'id' }));
  };

  const handleChange = (checked, p) => {
    if (checked) {
      setSelected([p, ...selected]);
    } else {
      setSelected(selected.filter(x => x.id !== p.id));
    }
  };

  const handleAddPlaylist = () => setIsNewPlaylist(true);

  const handleChangeNewPlaylist = (e, { value }) => setNewPlaylist(value);

  const handleCancelNewPlaylist = () => {
    setIsNewPlaylist(false);
    setNewPlaylist('');
  };

  const handleSaveNewPlaylist = e => {
    e.preventDefault();
    e.stopPropagation();
    !!newPlaylist && dispatch(actions.add(MY_NAMESPACE_PLAYLISTS, { name: newPlaylist }));
    setAlertMsg(t('personal.newPlaylistSuccessful', { name: newPlaylist }));
    setCountNew(countNew + 1);
    setIsNewPlaylist(false);
    setNewPlaylist('');
  };

  const handleOpenModal = e => {
    e.preventDefault();
    e.stopPropagation();
    toggle();
  };

  const toggle = () => {
    if (!user)
      return setIsNeedLogin(true);
    setIsOpen(!isOpen);
    setNewPlaylist('');
    setIsNewPlaylist(false);
    return null;
  };

  const save = () => {
    const adds = selected.filter(p => !saved.some(x => p.id === x.id));
    adds.forEach((p, i) => dispatch(actions.add(MY_NAMESPACE_PLAYLISTS, {
      id: p.id,
      items: [{ position: p.max_position + 1, content_unit_uid: cuID }],
      changeItems: true
    })));
    const deletes = saved.filter(p => !selected.some(x => p.id === x.id));
    deletes.forEach(p => dispatch(actions.remove(MY_NAMESPACE_PLAYLISTS, {
      id: p.id,
      ids: p.items?.map(pi => pi.id),
      changeItems: true
    })));
    toggle();

    setAlertMsg(t('personal.addToPlaylistSuccessful'));
  };

  const onAlertCloseHandler = () => {
    setAlertMsg(null);
    handleClose && setTimeout(handleClose, 0);
  };

  const renderPlaylist = p => (
    <List.Item key={p.id}>
      <List.Content floated='left'>
        <Checkbox
          checked={selected.some(x => x.id === p.id)}
          onChange={(e, { checked }) => handleChange(checked, p)}
        />
      </List.Content>
      <List.Content>
        {p.name}
      </List.Content>
    </List.Item>
  );

  return (
    <>
      <AlertModal message={alertMsg} open={!!alertMsg} onClose={onAlertCloseHandler} />
      <Modal
        closeIcon
        open={isNeedLogin}
        onClose={() => setIsNeedLogin(false)}
        onOpen={() => setIsNeedLogin(true)}
        dir={dir}
      >
        <Modal.Content>
          <NeedToLogin />
        </Modal.Content>
      </Modal>
      <Modal
        closeIcon
        open={isOpen}
        onOpen={onOpen}
        onClose={toggle}
        size={'tiny'}
        trigger={
          <Button
            basic
            className="my_playlist_add clear_button uppercase no-padding"
            onClick={handleOpenModal}
          >
            <PlaylistAddIcon className="playlist_add" fill="#767676" />
            <span>{t('buttons.save')}</span>
          </Button>
        }
        dir={dir}
      >
        <Modal.Header>{t('personal.addToPlaylist')}</Modal.Header>
        <Modal.Content>
          <List>
            {playlists.map(renderPlaylist)}
            <Divider hidden />
            {
              isNewPlaylist
                ? (
                  <List.Item key="playlist_form">
                    <List.Content floated='right'>
                      <Button
                        color="green"
                        icon="check"
                        onClick={handleSaveNewPlaylist}
                        disabled={!newPlaylist}
                      />
                      <Button
                        icon="close"
                        onClick={handleCancelNewPlaylist}
                      />
                    </List.Content>
                    <List.Content>
                      <Input
                        fluid
                        type="text"
                        maxLength={30}
                        onChange={handleChangeNewPlaylist}
                        placeholder={t('personal.newPlaylistName')}
                      />
                    </List.Content>
                  </List.Item>
                )
                : (
                  <List.Item key="add_playlist" onClick={handleAddPlaylist}>
                    <List.Content floated='left'>
                      <Icon name="plus" />
                    </List.Content>
                    <List.Content>
                      {t('personal.newPlaylist')}
                    </List.Content>
                  </List.Item>
                )
            }

          </List>
        </Modal.Content>
        {
          !isNewPlaylist && (
            <Modal.Actions>
              <Button
                primary
                content={t('buttons.save')}
                onClick={save}
                className="uppercase"
              />
              <Button
                primary
                content={t('buttons.cancel')}
                onClick={toggle}
              />
            </Modal.Actions>
          )
        }
      </Modal>
    </>
  );
};

PlaylistInfo.propTypes = {
  cuID: PropTypes.string.isRequired,
};

export default PlaylistInfo;
