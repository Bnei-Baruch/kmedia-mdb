import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Popup, Label, Icon } from 'semantic-ui-react';
import NoteModal from '../NoteModal';
import { getLanguageDirection } from '../../../helpers/i18n-utils';
import { useSelector } from 'react-redux';
import { selectors as settings } from '../../../redux/modules/settings';

const AddNoteBtn = ({ properties, toggleToolbar }) => {
  const [open, setOpen] = useState(false);

  const { t }    = useTranslation();
  const language = useSelector(state => settings.getLanguage(state.settings));
  const dir      = getLanguageDirection(language);

  const handleOpen       = () => setOpen(true);
  const handleToggleOpen = (o) => {
    setOpen(o);
    toggleToolbar(o);
  };

  return (
    <>
      {open && <NoteModal toggleOpen={handleToggleOpen} note={properties} />}
      <Popup
        content={t('messages.add-new-note')}
        dir={dir}
        trigger={
          <Button
            circular
            onClick={handleOpen}
            color="orange"
          >
            <div style={{ position: 'relative' }}>
              <Icon name="comment outline" />
              <Label color="red" floating content={t('messages.new')} attached="top left" />
            </div>
          </Button>
        }
      />
    </>
  );
};

export default AddNoteBtn;
