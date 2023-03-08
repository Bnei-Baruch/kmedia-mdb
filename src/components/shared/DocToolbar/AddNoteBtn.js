import React, { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { Button, Popup, Label, Icon } from 'semantic-ui-react';
import NoteModal from '../NoteModal';

const AddNoteBtn = ({ t, properties }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleToggleOpen = (o) => {
    setOpen(o);
  };

  return (
    <>
      {open && <NoteModal toggleOpen={handleToggleOpen} properties={properties} />}
      <Popup
        content={t('share-text.tag-button-alt')}
        trigger={
          <Button
            icon="comment outline"
            circular
            onClick={handleOpen}
            color="orange"
          >
            <div style={{position: 'relative'}}>
              <Icon name="comment outline" />
              <Label color="red" floating content={'new'} attached="top left"  />
            </div>
          </Button>
        }
      />
    </>
  );
};

export default withNamespaces()(AddNoteBtn);
