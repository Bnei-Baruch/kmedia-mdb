import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Button, Checkbox, Container, Label, Menu, MenuItem } from 'semantic-ui-react';

import SelectTopicsModal from '../SelectTopicsModal/SelectTopicsModal';

const BookmarkActions = ({ t, newFolder, onCancel, onSave, name }) => {
  const [isPublic, setIsPublic] = useState(false);
  const [open, setOpen]         = useState(false);
  const [topics, setTopics]     = useState([]);

  const handlePublicChange = (e, { checked }) => setIsPublic(checked);

  const handleSave = () => {
    const params = {};
    if (isPublic)
      params.public = isPublic;
    if (topics)
      params.tag_uids = topics;

    onSave(params);
  };

  return (
    <>
      <Container fluid>
        <Button
          primary
          basic
          content={t('personal.bookmark.newFolder')}
          onClick={newFolder}
        />
      </Container>
      <Menu secondary>
        <Menu.Item>
          <Checkbox
            onChange={handlePublicChange}
            label={t('personal.shareForAll')}
          />
        </Menu.Item>
        <Menu.Item>
          <Button
            basic
            onClick={() => setOpen(true)}
            disabled={!isPublic}
            circular
          >
            {t('topics.header.text')}
            <Label color='red' floating circular content={'text'} />
          </Button>
        </Menu.Item>
        <Menu.Item position="right">
          <Button
            primary
            content={t('buttons.save')}
            onClick={handleSave}
            disabled={!name}
            className="margin-right-8 margin-left-8"
          />
          <Button
            content={t('buttons.cancel')}
            onClick={onCancel}
            color="grey"
          />
        </Menu.Item>
      </Menu>
      <SelectTopicsModal
        onClose={() => setOpen(false)}
        selected={topics}
        setSelected={setTopics}
        open={open}
      />
    </>
  );
};

BookmarkActions.propTypes = {
  t: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  newFolder: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  name: PropTypes.string,
};

export default withNamespaces()(BookmarkActions);
