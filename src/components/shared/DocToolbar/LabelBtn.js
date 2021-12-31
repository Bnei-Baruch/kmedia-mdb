import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Button, MenuItem, Popup } from 'semantic-ui-react';
import AlertModal from '../AlertModal';
import SelectTopicsModal from '../SelectTopicsModal/SelectTopicsModal';

const LabelBtn = ({ t, source }) => {
  const [open, setOpen] = useState(false);


  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <SelectTopicsModal
        source={source}
        open={open}
        onClose={handleClose}
        trigger={
          <Popup
            content={t('share-text.label-button-alt')}
            trigger={
              <MenuItem onClick={handleOpen}>
                <Button circular icon="sticky note"/>
                {t('share-text.note-button')}
              </MenuItem>
            }
          />
        }
      />
    </>

  );
};

LabelBtn.propTypes = {
  t: PropTypes.func.isRequired,
  query: PropTypes.object,
  source: PropTypes.object,
};

export default withNamespaces()(LabelBtn);
