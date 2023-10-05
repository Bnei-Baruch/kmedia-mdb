import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, MenuItem } from 'semantic-ui-react';
import SelectTopicsModal from '../../../../shared/SelectTopicsModal/SelectTopicsModal';
import { useTranslation } from 'next-i18next';
import { useDispatch } from 'react-redux';
import { actions, playerSlice } from '../../../../../../lib/redux/slices/playerSlice/playerSlice';
import { PLAYER_OVER_MODES } from '../../../../../helpers/consts';

const TagVideoLabelBtn = ({ label, onClose }) => {
  const [open, setOpen] = useState(false);
  const { t }           = useTranslation();
  const dispatch = useDispatch();
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onClose && onClose();
    dispatch(playerSlice.actions.setOverMode(PLAYER_OVER_MODES.none));
  };

  return (
    <SelectTopicsModal
      label={label}
      open={open}
      onClose={handleClose}
      trigger={
        <MenuItem onClick={handleOpen}>
          <Button
            size="small"
            color="green"
            content={t('personal.label.tagging')}
          />
        </MenuItem>
      }
    />
  );
};

TagVideoLabelBtn.propTypes = {
  label: PropTypes.object,
};

export default TagVideoLabelBtn;
