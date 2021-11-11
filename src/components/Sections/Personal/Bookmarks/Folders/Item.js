import React, { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { Button, Grid, Icon, Input } from 'semantic-ui-react';

import { actions } from '../../../../../redux/modules/my';
import { MY_BOOKMARK_FILTER_FOLDER_ID, MY_NAMESPACE_FOLDERS } from '../../../../../helpers/consts';
import { actions as filtersActions, selectors as filtersSelectors } from '../../../../../redux/modules/bookmarkFilter';
import { useDispatch, useSelector } from 'react-redux';

const FolderItem = ({ folder }) => {
  const [edit, setEdit] = useState();
  const [name, setName] = useState();

  const { id } = folder;

  const selectedId = useSelector(state => filtersSelectors.getByKey(state.bookmarkFilter, MY_BOOKMARK_FILTER_FOLDER_ID));
  const isAll      = id === 'all';
  const isSelect   = isAll ? !selectedId : id === selectedId;

  const dispatch = useDispatch();

  const handleSelectFolder = () => dispatch(filtersActions.addFilter(MY_BOOKMARK_FILTER_FOLDER_ID, isAll ? null : id));

  const handleEditFolder = () => {
    setEdit(true);
    setName(folder.name);
  };

  const handleChangeName = (e, { value }) => setName(value);

  const handleUpdateFolder = () => {
    dispatch(actions.edit(MY_NAMESPACE_FOLDERS, { id, name }));
    setEdit(false);
  };

  const handleRemoveFolder = () => dispatch(actions.remove(MY_NAMESPACE_FOLDERS, { id }));

  const rowProps = { key: id, className: 'margin-top-4 margin-bottom-4' };
  if (isSelect)
    rowProps.color = 'blue';

  return (
    <Grid.Row {...rowProps}>
      <Grid.Column width={isAll ? 16 : 12} onClick={handleSelectFolder}>
        <Icon name="folder outline" />
        {
          !edit ? folder.name : (
            <Input
              autoSelect
              onChange={handleChangeName}
              onFocus={e => e.target.select()}
              defaultValue={folder.name}
            />
          )
        }
      </Grid.Column>
      {
        isAll ? null : (
          <Grid.Column width="4">
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
