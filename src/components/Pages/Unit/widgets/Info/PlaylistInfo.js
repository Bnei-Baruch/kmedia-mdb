import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Checkbox, Icon, Input, Label, Menu, Modal } from 'semantic-ui-react';

import * as shapes from '../../../../shapes';
import { actions, selectors } from '../../../../../redux/modules/my';
import { MY_NAMESPACE_PLAYLIST_ITEMS, MY_NAMESPACE_PLAYLISTS } from '../../../../../helpers/consts';
import AlertModal from '../../../../shared/AlertModal';

const PlaylistInfo = ({ unit = {}, t, user }) => {
  const [isOpen, setIsOpen]               = useState(false);
  const [selected, setSelected]           = useState([]);
  const [saved, setSaved]                 = useState([]);
  const [newPlaylist, setNewPlaylist]     = useState('');
  const [isNewPlaylist, setIsNewPlaylist] = useState(false);
  const [alertOpen, setAlertOpen]         = useState(false);
  const [alertMsg, setAlertMsg]           = useState();

  const dispatch = useDispatch();

  const playlists     = useSelector(state => selectors.getItems(state.my, MY_NAMESPACE_PLAYLISTS));
  const playlistItems = useSelector(state => selectors.getItems(state.my, MY_NAMESPACE_PLAYLIST_ITEMS));

  useEffect(() => {
    const _saved = playlistItems.filter(pi => pi.content_unit_uid === unit.id).map(p => p.playlist_id);
    setSaved(_saved);
    const ids = isNewPlaylist ? playlists.filter(p => p.name === newPlaylist).map(p => p.id) : [];
    setSelected(selected.concat(ids, _saved));
    setNewPlaylist('');
    setIsNewPlaylist(false);
  }, [playlists, playlistItems]);

  const onOpen = () => {
    dispatch(actions.fetch(MY_NAMESPACE_PLAYLISTS, { page_no: 1, page_size: 100 }));
    dispatch(actions.fetch(MY_NAMESPACE_PLAYLIST_ITEMS, { uids: [unit.id] }));
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
    setAlertOpen(true);
  };

  const toggle = () => {
    setSelected([]);
    setIsOpen(!isOpen);
  };

  const save = () => {
    const aIds = selected.filter(id => !saved.includes(id));
    aIds.forEach(id => dispatch(actions.add(MY_NAMESPACE_PLAYLISTS, { id, uids: [unit.id] })));
    const dIds = saved.filter(id => !selected.includes(id));
    dIds.forEach(id => dispatch(actions.remove(MY_NAMESPACE_PLAYLIST_ITEMS, { playlist_id: id, uids: [unit.id] })));
    toggle();

    setAlertMsg(t('personal.addToPlaylistSuccessful'));
    setAlertOpen(true);
  };

  const onAlertCloseHandler = () => {
    setAlertOpen(false);
    setAlertMsg('');
  };

  const renderPlaylist = (p) => (
    <Menu.Item key={p.id} name={p.name}>
      <Checkbox
        label={p.name}
        value={p.id}
        checked={selected.includes(p.id)}
        onChange={handleChange}
      />
    </Menu.Item>
  );

  const buttons = isNewPlaylist ?
    (
      <>
        <Button
          primary
          content={t('buttons.save')}
          onClick={handleSaveNewPlaylist}
        />
        <Button
          primary
          content={t('buttons.cancel')}
          onClick={handleCancelNewPlaylist}
        />
      </>
    )
    : (
      <>
        <Button
          primary
          content={t('buttons.save')}
          onClick={save}
        />
        <Button
          primary
          content={t('buttons.cancel')}
          onClick={toggle}
        />
      </>
    );

  return (
    <>
      <AlertModal message={alertMsg} open={alertOpen} onClose={onAlertCloseHandler} />
      <Modal
        closeIcon
        open={isOpen}
        onOpen={onOpen}
        onClose={toggle}
        size={'mini'}
        trigger={
          <Button className="dateButton" onClick={toggle}>
            <Icon name='calendar alternate outline' />
            {t('personal.savePlaylist')}
          </Button>
        }
      >
        <Modal.Header>{t('personal.addToPlaylist')}</Modal.Header>
        <Modal.Content>
          <Menu vertical borderless fluid secondary>
            {playlists.map(renderPlaylist)}
          </Menu>
          {
            isNewPlaylist
              ? (
                <Input
                  type="text"
                  fluid
                  maxLength={30}
                  onChange={handleChangeNewPlaylist}
                  placeholder={t('personal.newPlaylistName')}
                />
              )
              : <Menu.Item icon="plus" name={t('personal.newPlaylist')} onClick={handleAddPlaylist} />
          }

        </Modal.Content>
        <Modal.Actions>
          {buttons}
        </Modal.Actions>
      </Modal>
    </>
  );
};

PlaylistInfo.propTypes = {
  unit: shapes.ContentUnit,

};

export default PlaylistInfo;
