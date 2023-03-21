import React, { useState } from 'react';
import { Modal, Button, TextArea, Confirm, Form, Icon } from 'semantic-ui-react';
import { getLanguageDirection } from '../../helpers/i18n-utils';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../../redux/modules/myNotes';
import moment, { now } from 'moment/moment';
import { useTranslation } from 'react-i18next';
import { selectors as settings } from '../../redux/modules/settings';

const NoteModal = ({ note = false, properties, open = true, toggleOpen }) => {
  const [content, setContent] = useState(note.content || '');
  const [confirm, setConfirm] = useState(false);

  const { t }       = useTranslation();
  const defLanguage = useSelector(state => settings.getLanguage(state.settings));
  const dir         = getLanguageDirection(properties?.language || defLanguage);
  const dispatch    = useDispatch();

  const handleSave            = () => {
    !note ? dispatch(actions.add(content, properties)) : dispatch(actions.edit(content, note.id));
    toggleOpen(false);
  };
  const handleOnClose         = () => {
    toggleOpen(false);
  };
  const handleOnChange        = (e, { value }) => {
    setContent(value);
  };
  const handleRemove          = () => {
    if (!note) {
      handleOnClose();
      return;
    }
    setConfirm(true);
  };
  const handleConfirmedRemove = () => {
    dispatch(actions.remove({ id: note.id }));
    handleOnClose();
    setConfirm(false);
  };
  const handleCancelConfirm   = () => {
    setConfirm(false);
  };

  return (
    <>
      <Confirm open={confirm} onConfirm={handleConfirmedRemove} onCancel={handleCancelConfirm} />
      <Modal
        closeIcon
        size="large"
        open={open}
        onClose={handleOnClose}
        dir={dir}
        className="note_modal"
      >
        <Modal.Content>
          <div>{moment.utc(note.created_at || now()).format('YYYY-MM-DD')}</div>
          <Form>
            <TextArea
              onChange={handleOnChange}
              value={content}
              className="note_modal_textarea"
            />
          </Form>
        </Modal.Content>

        <Modal.Actions dir="ltr">
          <Button
            onClick={handleSave}
            content={t('buttons.save')}
            color="blue"
          />
          <Button
            inverted
            onClick={handleRemove}
            color="blue"
          >
            {
              note ? (
                <>
                  {t('buttons.remove')}
                  <Icon name="trash alternate outline" />
                </>
              ) : t('buttons.cancel')
            }
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default NoteModal;
