import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';
import { Button, Checkbox, Icon, Input, List, Modal, Divider } from 'semantic-ui-react';

import { actions, selectors } from '../../../../../redux/modules/my';
import { selectors as auth } from '../../../../../redux/modules/auth';
import { selectors as settings } from '../../../../../redux/modules/settings';
import { MY_NAMESPACE_PLAYLIST_EDIT, MY_NAMESPACE_PLAYLISTS } from '../../../../../helpers/consts';
import { getLanguageDirection } from '../../../../../helpers/i18n-utils';
import AlertModal from '../../../../shared/AlertModal';
import PlaylistAddIcon from '../../../../../images/icons/PlaylistAdd';
import NeedToLogin from '../../../../Sections/Personal/NeedToLogin';
import { stopBubbling } from '../../../../../helpers/utils';

const updateStatus = { save: 1, delete: 2 };

const PlaylistInfo = ({ cuID, t, handleClose = null }) => {
  const [isOpen, setIsOpen]               = useState(false);
  const [alertMsg, setAlertMsg]           = useState();
  const [isNeedLogin, setIsNeedLogin]     = useState();
  const [selected, setSelected]           = useState([]);
  const [forUpdate, setForUpdate]         = useState({ count: 0 });
  const [newPlaylist, setNewPlaylist]     = useState('');
  const [isNewPlaylist, setIsNewPlaylist] = useState(false);
  const [countNew, setCountNew]           = useState(0);

  const dispatch = useDispatch();

  const playlists = useSelector(state => selectors.getList(state.my, MY_NAMESPACE_PLAYLIST_EDIT));
  const total     = useSelector(state => selectors.getTotal(state.my, MY_NAMESPACE_PLAYLIST_EDIT));
  const language  = useSelector(state => settings.getLanguage(state.settings));
  const user      = useSelector(state => auth.getUser(state.auth));
  const saved     = playlists.filter(p => !!p.items);

  useEffect(() => {
    if (total !== 0) {
      const s      = playlists.slice(0, countNew).filter(x => !forUpdate[x.id]);
      const update = s.reduce((acc, x) => {
        acc[x.id] = updateStatus.save;
        return acc;
      }, {});
      setForUpdate({ ...forUpdate, ...update, count: forUpdate.count + s.length });
      setSelected([...s, ...saved]);
    }
  }, [total]);

  const dir = getLanguageDirection(language);

  const onOpen = () => {
    setSelected([]);
    setCountNew(0);
    setForUpdate({ count: 0 });
    dispatch(actions.fetch(MY_NAMESPACE_PLAYLIST_EDIT, { 'exist_cu': cuID, order_by: 'id DESC' }));
  };

  const handleChange = (checked, p) => {
    let status = null;
    if (checked) {
      setSelected([p, ...selected]);

      if (forUpdate[p.id] !== updateStatus.delete) {
        status = updateStatus.save;
      }
    } else {
      setSelected(selected.filter(x => x.id !== p.id));
      if (forUpdate[p.id] !== updateStatus.save) {
        status = updateStatus.delete;
      }
    }

    const count = (!!forUpdate[p.id] && status === null) ? -1 : 1;
    setForUpdate({ ...forUpdate, [p.id]: status, count: forUpdate.count + count });
  };

  const handleAddPlaylist = () => setIsNewPlaylist(true);

  const handleChangeNewPlaylist = (e, { value }) => setNewPlaylist(value);

  const handleCancelNewPlaylist = () => {
    setIsNewPlaylist(false);
    setNewPlaylist('');
  };

  const handleSaveNewPlaylist = e => {
    stopBubbling(e)
    !!newPlaylist && dispatch(actions.add(MY_NAMESPACE_PLAYLIST_EDIT, { name: newPlaylist }));
    setAlertMsg(t('personal.newPlaylistSuccessful', { name: newPlaylist }));
    setCountNew(countNew + 1);
    setIsNewPlaylist(false);
    setNewPlaylist('');
  };

  const handleOpenModal = e => {
    stopBubbling(e)
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
            {(playlists.length === 0) && t(`personal.no_${MY_NAMESPACE_PLAYLISTS}`)}
            <Divider hidden />
            {
              isNewPlaylist || playlists.length === 0
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
                disabled={!forUpdate.count}
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
