import React, { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Grid, Icon, Input } from 'semantic-ui-react';
import clsx from 'clsx';

import { actions } from '../../../../../redux/modules/my';
import { actions as filtersActions, selectors as filtersSelectors } from '../../../../../redux/modules/bookmarkFilter';
import { MY_BOOKMARK_FILTER_FOLDER_ID, MY_NAMESPACE_FOLDERS } from '../../../../../helpers/consts';
import { getMyItemKey } from '../../../../../helpers/my';
import { stopBubbling } from '../../../../../helpers/utils';

const FolderItem = ({ folder }) => {
  const [edit, setEdit] = useState();
  const [name, setName] = useState();

  const { id }  = folder;
  const { key } = getMyItemKey(MY_NAMESPACE_FOLDERS, folder);

  const selectedId = useSelector(state => filtersSelectors.getByKey(state.bookmarkFilter, MY_BOOKMARK_FILTER_FOLDER_ID));
  const isAll      = id === 'all';
  const isSelect   = isAll ? !selectedId : id === selectedId;

  const dispatch = useDispatch();

  const handleSelectFolder = () => dispatch(filtersActions.addFilter(MY_BOOKMARK_FILTER_FOLDER_ID, isAll ? null : id));

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

  const handleRemoveFolder = () => dispatch(actions.remove(MY_NAMESPACE_FOLDERS, { id, key }));

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
        {!edit && <Icon name="folder outline" />}
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
                    icon='check'
                    basic
                    compact
                    onClick={handleUpdateFolder}
                    className="no-shadow"
                  />
                ) :
                (
                  <Button
                    icon='pencil'
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
              icon='trash alternate outline'
              onClick={handleRemoveFolder}
            />
          </Grid.Column>
        )
      }
    </Grid.Row>
  );
};

export default withNamespaces()(FolderItem);
