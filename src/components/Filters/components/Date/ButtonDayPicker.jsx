import PropTypes from 'prop-types';
import React, { useContext } from 'react';

import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import { noop } from '../../../../helpers/utils';
import ButtonDayPickerDesktop from './ButtonDayPickerDesktop';
import ButtonDayPickerMobile from './ButtonDayPickerMobile';

const ButtonDayPicker = ({ value = null, label = '', onDayChange = noop, withLabel }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  return isMobileDevice
    ? <ButtonDayPickerMobile value={value} label={label} onDayChange={onDayChange} withLabel={withLabel} />
    : <ButtonDayPickerDesktop value={value} label={label} onDayChange={onDayChange} />;
};

ButtonDayPicker.propTypes = {
  value      : PropTypes.instanceOf(Date),
  label      : PropTypes.string,
  onDayChange: PropTypes.func,
  withLabel  : PropTypes.bool,
};

export default ButtonDayPicker;
