import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'next-i18next';
import { Button, Popup, } from 'semantic-ui-react';

import { SectionLogo } from '../../../helpers/images';
import SelectTopicsModal from './SelectTopicsModal';

const LabelButton = () => {
  const [open, setOpen] = useState();
  const { t }           = useTranslation();

  const handleOpen  = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <SelectTopicsModal
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
