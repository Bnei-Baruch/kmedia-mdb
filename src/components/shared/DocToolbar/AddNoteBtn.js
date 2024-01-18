import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Popup } from 'semantic-ui-react';
import NoteModal from '../NoteModal';
import { useSelector } from 'react-redux';
import { settingsGetUIDirSelector } from '../../../redux/selectors';

const AddNoteBtn = ({ properties, toggleToolbar }) => {
  const [open, setOpen] = useState(false);

  const { t } = useTranslation();
  const uiDir = useSelector(settingsGetUIDirSelector);

  const handleOpen       = () => setOpen(true);
  const handleToggleOpen = o => {
    setOpen(o);
    toggleToolbar(o);
  };

  return (
    <>
      {open && <NoteModal toggleOpen={handleToggleOpen} note={properties}/>}
      <Popup
        content={t('messages.add-new-note')}
        dir={uiDir}
        trigger={
          <Button
            circular
            onClick={handleOpen}
            color="orange"
            icon="comment outline"
          />
        }
      />
    </>
  );
};

export default AddNoteBtn;
