import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Button, MenuItem, Popup } from 'semantic-ui-react';
import SelectTopicsModal from '../SelectTopicsModal/SelectTopicsModal';
import { SectionLogo } from '../../../helpers/images';

const LabelBtn = ({ t, label }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <SelectTopicsModal
      label={label}
      open={open}
      onClose={handleClose}
      trigger={
        <Popup
          content={t('share-text.tag-button-alt')}
          trigger={
            <MenuItem onClick={handleOpen}>
              <Button circular icon className="no-padding">
                <SectionLogo name="topics" color="grey" />
              </Button>
              {t('share-text.tag-button')}
            </MenuItem>
          }
        />
      }
    />
  );
};

LabelBtn.propTypes = {
  t: PropTypes.func.isRequired,
  query: PropTypes.object,
  label: PropTypes.object,
};

export default withTranslation()(LabelBtn);
