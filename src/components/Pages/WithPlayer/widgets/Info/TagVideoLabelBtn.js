import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SelectTopicsModal from '../../../../shared/SelectTopicsModal/SelectTopicsModal';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { actions } from '../../../../../redux/modules/player';
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
    dispatch(actions.setOverMode(PLAYER_OVER_MODES.none));
  };

  return (
    <SelectTopicsModal
      label={label}
      open={open}
      onClose={handleClose}
      trigger={
        <div onClick={handleOpen}>
          <button
            className="px-3 py-1.5 bg-green-600 text-white rounded small"
          >
            {t('personal.label.tagging')}
          </button>
        </div>
      }
    />
  );
};

TagVideoLabelBtn.propTypes = {
  label: PropTypes.object,
};

export default TagVideoLabelBtn;
