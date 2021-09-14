import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';
import { Button, Checkbox, Icon, Input, List, Modal, Divider } from 'semantic-ui-react';

import { actions, selectors } from '../../../../../redux/modules/my';
import { selectors as auth } from '../../../../../redux/modules/auth';
import { MY_NAMESPACE_PLAYLIST_ITEMS, MY_NAMESPACE_PLAYLISTS } from '../../../../../helpers/consts';
import AlertModal from '../../../../shared/AlertModal';
import PlaylistAddIcon from '../../../../../images/icons/PlaylistAdd';
import NeedToLogin from '../../../../Sections/Personal/NeedToLogin';
import { getLanguageDirection } from '../../../../../helpers/i18n-utils';

const PlaylistInfo = ({ cuID, t, handleClose = null, language }) => {
  const [isOpen, setIsOpen]               = useState(false);
  const [selected, setSelected]           = useState([]);
  const [saved, setSaved]                 = useState([]);
  const [newPlaylist, setNewPlaylist]     = useState('');
  const [isNewPlaylist, setIsNewPlaylist] = useState(false);
  const [alertMsg, setAlertMsg]           = useState();
  const [isNeedLogin, setIsNeedLogin]     = useState();

  const dir      = getLanguageDirection(language);
  const dispatch = useDispatch();

  const playlists     = useSelector(state => selectors.getItems(state.my, MY_NAMESPACE_PLAYLISTS));
  const playlistItems = useSelector(state => selectors.getItems(state.my, MY_NAMESPACE_PLAYLIST_ITEMS));
  const user          = useSelector(state => auth.getUser(state.auth));

  useEffect(() => {
    const _saved = playlistItems.filter(pi => pi.content_unit_uid === cuID).map(p => p.playlist_id);
    setSaved(_saved);
    const ids = isNewPlaylist ? playlists.filter(p => p.name === newPlaylist).map(p => p.id) : [];
    setSelected(selected.concat(ids, _saved));
    setNewPlaylist('');
    setIsNewPlaylist(false);
  }, [playlists, playlistItems]);

  const onOpen = () => {
    dispatch(actions.fetch(MY_NAMESPACE_PLAYLISTS, { page_no: 1, page_size: 100 }));
    dispatch(actions.fetch(MY_NAMESPACE_PLAYLIST_ITEMS, { uids: [cuID] }));
  };

  const handleChange = (e, d) => {
    if (d.checked) {
      setSelected([d.value, ...selected]);
    } else {
      setSelected(selected.filter(x => x !== d.value));
    }
  };

  const handleAddPlaylist = () => setIsNewPlaylist(true);

  const handleChangeNewPlaylist = (e, { value }) => setNewPlaylist(value);

  const handleCancelNewPlaylist = () => {
    setIsNewPlaylist(false);
    setNewPlaylist('');
  };

  const handleSaveNewPlaylist = () => {
    !!newPlaylist && dispatch(actions.add(MY_NAMESPACE_PLAYLISTS, { name: newPlaylist }));
    setAlertMsg(t('personal.newPlaylistSuccessful', { name: newPlaylist }));
  };

  const toggle = () => {
    if (!user)
      return setIsNeedLogin(true);
    setSelected([]);
    setIsOpen(!isOpen);
    return null;
  };

  const save = () => {
    const aIds = selected.filter(id => !saved.includes(id));
    aIds.forEach(id => dispatch(actions.add(MY_NAMESPACE_PLAYLISTS, { id, uids: [cuID] })));
    const dIds = saved.filter(id => !selected.includes(id));
    dIds.forEach(id => dispatch(actions.remove(MY_NAMESPACE_PLAYLIST_ITEMS, { playlist_id: id, uids: [cuID] })));
    toggle();

    setAlertMsg(t('personal.addToPlaylistSuccessful'));
  };

  const onAlertCloseHandler = () => {
    setAlertMsg(null);
    handleClose && setTimeout(handleClose, 0);
  };

  const renderPlaylist = (p) => (
    <List.Item key={p.id}>
      <List.Content floated='left'>
        <Checkbox
          value={p.id}
          checked={selected.includes(p.id)}
          onChange={handleChange}
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
        direction={dir}
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
          <Button basic className="my_playlist_add clear_button uppercase no-padding" onClick={toggle}>
            <PlaylistAddIcon className="playlist_add" fill="#767676" />
            <span>{t('buttons.save')}</span>
          </Button>
        }
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
      </Modal>
    </>
  );
};

PlaylistInfo.propTypes = {
  cuID: PropTypes.string.isRequired,
};

export default PlaylistInfo;
