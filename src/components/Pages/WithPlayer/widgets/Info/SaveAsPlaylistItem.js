import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Checkbox, Icon, Input, List, Modal, Divider } from 'semantic-ui-react';

import { actions, selectors } from '../../../../../redux/modules/my';
import { selectors as settings } from '../../../../../redux/modules/settings';
import { selectors as playlist } from '../../../../../redux/modules/playlist';
import { actions as playerActions } from '../../../../../redux/modules/player';
import { MY_NAMESPACE_PLAYLIST_EDIT, MY_NAMESPACE_PLAYLISTS, PLAYER_OVER_MODES } from '../../../../../helpers/consts';
import { getLanguageDirection } from '../../../../../helpers/i18n-utils';
import { useTranslation } from 'react-i18next';
import { selectors as mdb } from '../../../../../redux/modules/mdb';
import AddPlaylistForm from './AddPlaylistForm';
import { ADD_PLAYLIST_ITEM_MODES } from './SavePlaylistItemBtn';

const SaveAsPlaylistItem = ({ setModalMode, label }) => {
  const [selected, setSelected] = useState([]);
  const [isNew, setIsNew]       = useState(false);

  const dispatch = useDispatch();
  const { t }    = useTranslation();

  const { cuId }  = useSelector(state => playlist.getInfo(state.playlist));
  const unit      = useSelector(state => mdb.getDenormContentUnit(state.mdb, cuId));
  const playlists = useSelector(state => selectors.getList(state.my, MY_NAMESPACE_PLAYLIST_EDIT));
  const language  = useSelector(state => settings.getLanguage(state.settings));

  const [name, setName] = useState(unit.name);

  const dir = getLanguageDirection(language);

  useEffect(() => {
    dispatch(actions.fetch(MY_NAMESPACE_PLAYLIST_EDIT, { 'exist_cu': cuId, order_by: 'id DESC' }));
  }, []);

  const handleChange = (checked, p) => {
    if (checked) {
      setSelected([p, ...selected]);
    } else {
      setSelected(selected.filter(x => x.id !== p.id));
    }
  };

  const toggleNewPlaylist = () => setIsNew(!isNew);

  const handleCancel = () => {
    setIsNew(false);
    setModalMode(ADD_PLAYLIST_ITEM_MODES.none);
    dispatch(playerActions.setOverMode(PLAYER_OVER_MODES.none));
  };

  const handleSave = () => {
    const { properties } = label;

    selected.forEach(p => dispatch(actions.add(MY_NAMESPACE_PLAYLISTS, {
      id: p.id,
      items: [{ position: -1, content_unit_uid: cuId, name, properties }],
      changeItems: true
    })));

    setIsNew(false);
    setModalMode(ADD_PLAYLIST_ITEM_MODES.label);

    dispatch(playerActions.setOverMode(PLAYER_OVER_MODES.none));
  };

  const handleNameChange = (e, { value }) => setName(value);

  const renderPlaylist = p => (
    <List.Item key={p.id}>
      <List.Content floated="left">
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
      <Modal
        closeIcon
        open={true}
        onClose={handleCancel}
        size={'tiny'}
        dir={dir}
      >
        <Modal.Header>{t('personal.addToPlaylist')}</Modal.Header>
        <Modal.Content>
          <Input
            fluid
            className="autocomplete"
            size="small"
            placeholder={t('buttons.name')}
            onChange={handleNameChange}
          >
            <input value={name} />
          </Input>
          <List>
            {playlists.map(renderPlaylist)}
            {(playlists.length === 0) && t(`personal.no_${MY_NAMESPACE_PLAYLISTS}`)}
            <Divider hidden />
            {
              (isNew || playlists.length === 0) ? (
                <AddPlaylistForm close={toggleNewPlaylist} />
              ) : (
                <List.Item key="add_playlist" onClick={toggleNewPlaylist}>
                  <List.Content floated="left">
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
          !isNew && (
            <Modal.Actions>
              <Button
                primary
                content={t('buttons.save')}
                onClick={handleSave}
                className="uppercase"
                disabled={!selected.length}
              />
              <Button
                primary
                content={t('buttons.cancel')}
                onClick={handleCancel}
              />
            </Modal.Actions>
          )
        }
      </Modal>
    </>
  );
};

export default SaveAsPlaylistItem;
