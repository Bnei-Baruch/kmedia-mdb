import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { clsx } from 'clsx';
import dayjs from '../../../../helpers/dayjs';
import PropTypes from 'prop-types';
import { useCallback, useRef, useState } from 'react';

import { today } from '../../../../helpers/date';
import { noop } from '../../../../helpers/utils';
import Icon from '../../../Icon';

const ButtonDayPickerMobile = ({ value = null, label = '', onDayChange = noop, withLabel }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const nativeDateInputRef = useRef();

  const openNativeDatePicker = useCallback(() => {
    nativeDateInputRef.current?.showPicker?.();
  }, []);

  const handleNativeDateInputChange = useCallback(event => {
    const date = event.target.valueAsDate;
    setSelectedDate(date);
    onDayChange(date);
  }, [onDayChange]);

  const selected = selectedDate || value;
  const selectedToString = selected ? dayjs(selected).format('YYYY-MM-DD') : '';

  return (
    <div
      className={clsx('dateButton inline-flex items-center py-2 font-bold cursor-pointer gap-1 md:text-sm', { 'dateButton_with_label': withLabel })}
      onClick={openNativeDatePicker}
    >
      <Icon icon={faCalendarDays} className="large" />
      {withLabel && label}
      <input
        className="hide-native-date-input"
        type="date"
        value={selectedToString}
        max={today().format('YYYY-MM-DD')}
        step="1"
        pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
        onChange={handleNativeDateInputChange}
        ref={nativeDateInputRef}
      />
    </div>
  );
};

ButtonDayPickerMobile.propTypes = {
  value: PropTypes.instanceOf(Date),
  label: PropTypes.string,
  onDayChange: PropTypes.func,
  withLabel: PropTypes.bool,
};

export default ButtonDayPickerMobile;
