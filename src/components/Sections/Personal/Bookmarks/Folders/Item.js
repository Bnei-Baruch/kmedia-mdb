import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Confirm, Grid, Icon, Input } from 'semantic-ui-react';
import clsx from 'clsx';

import { actions } from '../../../../../redux/modules/my';
import { MY_NAMESPACE_FOLDERS } from '../../../../../helpers/consts';
import { getMyItemKey } from '../../../../../helpers/my';
import { stopBubbling } from '../../../../../helpers/utils';
import { settingsGetUIDirSelector } from '../../../../../redux/selectors';

const FolderItem = ({ folder, selectedId, selectFolder, t }) => {
  const [edit, setEdit]       = useState();
  const [name, setName]       = useState();
  const [confirm, setConfirm] = useState();

  const uiDir = useSelector(settingsGetUIDirSelector);

  const { id }  = folder;
  const { key } = getMyItemKey(MY_NAMESPACE_FOLDERS, folder);

  const isAll    = id === 'all';
  const isSelect = isAll ? !selectedId : id === selectedId;

  const dispatch = useDispatch();

  const handleSelectFolder = () => selectFolder(isAll ? null : id);

  const handleEditFolder = () => {
    setEdit(true);
    setName(folder.name);
  };

  const handleChangeName = (e, { value }) => {
    stopBubbling(e);
    setName(value);
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      handleUpdateFolder();
    }
  };

  const handleUpdateFolder = e => {
    stopBubbling(e);
    dispatch(actions.edit(MY_NAMESPACE_FOLDERS, { id, name }));
    setEdit(false);
  };

  const toggleConfirm = () => setConfirm(!confirm);

  const handleConfirmSuccess = () => dispatch(actions.remove(MY_NAMESPACE_FOLDERS, { id, key }));

  const rowProps = { key: id, className: 'flex_nowrap' };
  if (isSelect)
    rowProps.className += ' active';

  return (
    <Grid.Row {...rowProps}>
      <Grid.Column
        mobile={isAll ? 16 : 11}
        tablet={isAll ? 16 : 9}
        computer={isAll ? 16 : 10}
        onClick={handleSelectFolder}
        className={clsx({ 'nowrap': edit })}
        verticalAlign={'middle'}
      >
        {!edit && <Icon name="folder outline"/>}
        {
          !edit ? folder.name : (
            <Input
              autoSelect
              onChange={handleChangeName}
              onClick={stopBubbling}
              onKeyDown={handleKeyDown}
              onFocus={e => e.target.select()}
              defaultValue={folder.name}
              fluid
            />
          )
        }
      </Grid.Column>
      {
        isAll ? null : (
          <Grid.Column
            mobile={5}
            tablet={7}
            computer={6}
            textAlign={'right'}
            className={clsx({ 'folder_actions': !edit })}
          >
            {
              edit ?
                (
                  <Button
                    icon="check"
                    basic
                    compact
                    onClick={handleUpdateFolder}
                    className="no-shadow"
                  />
                ) :
                (
                  <Button
                    icon="pencil"
                    basic
                    compact
                    className="no-shadow"
                    onClick={handleEditFolder}
                  />
                )
            }
            <Button
              basic
              compact
              className="no-shadow"
              icon="trash alternate outline"
              onClick={toggleConfirm}
            />

            <Confirm
              size="tiny"
              open={confirm}
              onCancel={toggleConfirm}
              onConfirm={handleConfirmSuccess}
              cancelButton={t('buttons.cancel')}
              confirmButton={t('buttons.apply')}
              content={t('personal.bookmark.confirmRemoveFolder', { name: folder.name })}
              dir={uiDir}
            />
          </Grid.Column>
        )
      }
    </Grid.Row>
  );
};

export default withTranslation()(FolderItem);
