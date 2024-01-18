import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Button, Container, Grid, Header, Icon, Input, Label, Modal } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';

import {
  MY_BOOKMARK_FILTER_FOLDER_ID,
  MY_BOOKMARK_FILTER_QUERY,
  MY_NAMESPACE_FOLDERS
} from '../../../../helpers/consts';
import { actions as filtersActions } from '../../../../redux/modules/bookmarkFilter';
import { getMyItemKey } from '../../../../helpers/my';
import FolderList from './Folders/List';
import { bookmarkFilterGetByKeySelector, myGetItemByKeySelector, settingsGetUIDirSelector } from '../../../../redux/selectors';

const BookmarkHeaderMobile = ({ t }) => {
  const [open, setOpen] = useState();

  const folder_id = useSelector(state => bookmarkFilterGetByKeySelector(state, MY_BOOKMARK_FILTER_FOLDER_ID));
  const query     = useSelector(state => bookmarkFilterGetByKeySelector(state, MY_BOOKMARK_FILTER_QUERY));

  const { key: fKey } = getMyItemKey(MY_NAMESPACE_FOLDERS, { id: folder_id });
  const folder        = useSelector(state => myGetItemByKeySelector(state, MY_NAMESPACE_FOLDERS, fKey));

  const dispatch = useDispatch();

  const handleSearch = query => dispatch(filtersActions.addFilter(MY_BOOKMARK_FILTER_QUERY, query));

  const handleToggle = () => setOpen(!open);

  const removeFolderFilter = e => {
    dispatch(filtersActions.deleteFilter(MY_BOOKMARK_FILTER_FOLDER_ID));
    e.stopPropagation();
  };

  const placeholder = !folder ? t('personal.bookmark.searchBookmarks') : `${t('personal.bookmark.filterByFolder')}: ${folder.name}`;

  const uiDir = useSelector(settingsGetUIDirSelector);

  const trigger = (
    <Container>
      <Label
        as="a"
        size="big"
        basic
        className="no-border padding_r_l_0"
        color="blue"
        onClick={handleToggle}
      >
        <Icon name="folder outline" color="grey"/>
        {t('personal.bookmark.folders')}
        <Icon
          name={`caret ${uiDir === 'ltr' ? 'right' : 'left'}`}
          className="margin-left-8 margin-right-8"
        />
      </Label>
      {
        folder && (
          <Label
            size="big"
            basic
            icon
            className="no-border"
          >
            {folder.name}
            <Button
              basic
              compact
              className="no-padding no-shadow"
              onClick={removeFolderFilter}
            >
              <Icon
                name="remove circle"
                color="grey"
                size="small"
                className="margin-left-8 margin-right-8"
              />
            </Button>
          </Label>
        )
      }
    </Container>
  );

  return (
    <Container className="padded">
      <Header as={'h2'} className="my_header padding-top_1em">
        <Icon name="bookmark outline" className="display-iblock"/>
        {t('personal.bookmark.title')}
      </Header>

      <Modal
        trigger={trigger}
        onOpen={handleToggle}
        onClose={handleToggle}
        open={open}
        dir={uiDir}
        closeIcon
      >
        <Modal.Content>
          <Grid className="no-padding">
            <Grid.Row>
              <FolderList close={handleToggle}/>
            </Grid.Row>
          </Grid>
        </Modal.Content>
      </Modal>
      <Input
        icon="search"
        placeholder={placeholder}
        defaultValue={query}
        onChange={(e, { value }) => handleSearch(value)}
        className="bookmark_search_mobile"
        iconPosition="left"
        fluid
      />
    </Container>
  );
};

export default withTranslation()(BookmarkHeaderMobile);
