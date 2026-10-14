import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { clsx } from 'clsx';
import dayjs from '../../../helpers/dayjs';
import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';

import { today } from '../../../helpers/date';
import { noop } from '../../../helpers/utils';
import Icon from '../../Icon';

const ButtonDayPickerMobile = ({ value = null, label = '', onDayChange = noop, withLabel }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleNativeDateInputChange = useCallback(event => {
    const date = event.target.valueAsDate;
    // iOS "Reset" clears the input
    if (!date) return;
    setSelectedDate(date);
    onDayChange(date);
  }, [onDayChange]);

  const selected = selectedDate || value;
  const selectedToString = selected ? dayjs(selected).format('YYYY-MM-DD') : '';

  return (
    <div
      className={clsx('dateButton button relative inline-flex items-center px-2! font-bold cursor-pointer gap-1 text-sm', { 'dateButton_with_label': withLabel })}
    >
      <Icon icon={faCalendarDays} className="text-gray-600 text-xl" />
      {withLabel && label}
      <input
        className="hide-native-date-input"
        type="date"
        value={selectedToString}
        max={today().format('YYYY-MM-DD')}
        step="1"
        pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
        onChange={handleNativeDateInputChange}
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
