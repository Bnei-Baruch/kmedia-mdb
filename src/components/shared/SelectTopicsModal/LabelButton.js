import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';

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
        <Popover className="relative inline-block">
          <PopoverButton
            as="button"
            className="label_icon px-2 py-1 small border rounded hover:bg-gray-100"
            onClick={handleOpen}
            disabled={disabled}
          >
            <SectionLogo name="topics" color="grey" />
          </PopoverButton>
          <PopoverPanel className="absolute z-10 bg-white border border-gray-200 rounded shadow-lg p-2 small">
            {t('share-text.tag-button-alt')}
          </PopoverPanel>
        </Popover>
      }
    />
  );
};

LabelButton.propTypes = { label: PropTypes.object.isRequired };

export default LabelButton;
