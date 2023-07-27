import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, Popup, } from 'semantic-ui-react';

import { SectionLogo } from '../../../helpers/images';
import SelectTopicsModal from './SelectTopicsModal';

const LabelButton = ({ label, disabled }) => {
  const [open, setOpen] = useState();
  const { t }           = useTranslation();

  const handleOpen  = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return !label ? null : (
    <SelectTopicsModal
      label={label}
      open={open}
      onClose={handleClose}
      trigger={
        <Popup
          content={t('share-text.tag-button-alt')}
          trigger={
            <Button
              compact
              size="small"
              icon={<SectionLogo name="topics" color="grey" />}
              onClick={handleOpen}
              disabled={disabled}
              className="label_icon"
            />
          }
        />
      }
    />
  );
};

LabelButton.propTypes = { label: PropTypes.object.isRequired };

export default LabelButton;
