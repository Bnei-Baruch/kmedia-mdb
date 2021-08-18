import { useDispatch } from 'react-redux';
import { canonicalLink } from '../../../helpers/links';
import { imageByUnit } from '../../../helpers/utils';
import { actions } from '../../../redux/modules/my';
import { MY_NAMESPACE_PLAYLISTS } from '../../../helpers/consts';
import { Button, Card, Header, Icon, Input, Menu, Modal, Table } from 'semantic-ui-react';
import UnitLogo from '../../shared/Logo/UnitLogo';
import React, { useEffect, useState } from 'react';
import Link from '../../Language/MultiLanguageLink';

export const PlaylistItem = ({ data: { item: playlist, unit }, t }) => {
  const [isEdit, setIsEdit] = useState();
  const [name, setName]     = useState();

  const dispatch         = useDispatch();
  const link             = canonicalLink(unit);
  const canonicalSection = imageByUnit(unit, link);

  const onOpen = () => {
    if (name !== playlist.name) setName(playlist.name);
  };

  const remove = () => dispatch(actions.remove(MY_NAMESPACE_PLAYLISTS, { ids: [playlist.id] }));

  const edit = () => setIsEdit(true);

  const handleChangeName = (e, { value }) => {
    setName(value);
  };

  const toggle = () => setIsEdit(false);

  const save = () => {
    dispatch(actions.edit(MY_NAMESPACE_PLAYLISTS, { id: playlist.id, name }));
    setIsEdit(false);
  };

  return (
    <Card raised>
      <>
        <div className="my_playlist_item">
          <Table className="over_layer">
            <Table.Row>
              <Table.Cell verticalAlign="middle" textAlign="center">
                <h2>{playlist.items?.length || 0}</h2>
                <Icon name="list" size="big" />
              </Table.Cell>
            </Table.Row>
          </Table>
          <UnitLogo width="100%" unitId={unit.id} fallbackImg={canonicalSection} />
        </div>
      </>
      <Card.Content>
        <Modal
          closeIcon
          onClose={toggle}
          onOpen={onOpen}
          open={isEdit}
          size={'mini'}
          trigger={<Button floated={'right'} size={'tiny'} icon={'edit'} onClick={edit} />}
        >
          <Modal.Header>{t('personal.editPlaylist')}</Modal.Header>
          <Modal.Content>
            <Menu vertical borderless fluid secondary>
              <Input
                type="text"
                fluid
                maxLength={30}
                onChange={handleChangeName}
                placeholder={t('personal.renamePlaylist')}
                value={name}
              />
            </Menu>
          </Modal.Content>
          <Modal.Actions>
            <Button
              primary
              content={t('buttons.apply')}
              onClick={save}
            />
            <Button
              primary
              content={t('buttons.cancel')}
              onClick={toggle}
            />
          </Modal.Actions>
        </Modal>

        <Button floated={'right'} size={'tiny'} icon={'remove'} onClick={remove} />
        <Header size="medium" floated="left">{playlist.name}</Header>
      </Card.Content>
      <Card.Content extra textAlign="center">
        <Link
          to={`/personal/${MY_NAMESPACE_PLAYLISTS}/${playlist.id}`}
          className="avbox__playlist-next-button"
          title={t('buttons.next')}
        >
          <Button
            basic
            size="large"
            content={t('personal.playlistPlay')}
            onClick={remove}
            color={'grey'}
          />
        </Link>
      </Card.Content>
    </Card>
  );
};
