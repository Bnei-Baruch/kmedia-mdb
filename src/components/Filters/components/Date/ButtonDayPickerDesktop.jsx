import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { useSelector } from 'react-redux';

import { today } from '../../../../helpers/date';
import { getDayPickerLocale } from '../../../../helpers/dayPickerLocale';
import { noop } from '../../../../helpers/utils';
import { selectors as settings } from '../../../../redux/modules/settings';
import Icon from '../../../Icon';

const ButtonDayPickerDesktop = ({ value = null, label = '', onDayChange = noop }) => {
  const uiLang = useSelector(state => settings.getUILang(state.settings));
  const uiDir  = useSelector(state => settings.getUIDir(state.settings));

  const [month, setMonth] = useState(value);
  const locale = getDayPickerLocale(uiLang);

  useEffect(() => setMonth(value), [value]);

  const handleDaySelect = useCallback((date, close) => {
    if (!date || date > today().add(1, 'days').toDate()) return;
    onDayChange(date);
    close();
  }, [onDayChange]);

  return (
    <Popover className="relative inline-block">
      <PopoverButton className="dateButton flex items-center gap-2 p-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-bold text-gray-500 whitespace-nowrap cursor-pointer h-full">
        <Icon icon={faCalendarDays} className="text-gray-200" />
        {label}
      </PopoverButton>
      <PopoverPanel className="absolute z-50 mt-1 bg-white text-gray-900 border border-gray-200 rounded shadow-lg p-4" dir={uiDir}>
        {({ close }) => (
          <DayPicker
            mode="single"
            captionLayout="dropdown"
            locale={locale}
            disabled={{ after: new Date() }}
            month={month || undefined}
            endMonth={today().toDate()}
            selected={value}
            onSelect={date => handleDaySelect(date, close)}
            onMonthChange={setMonth}
          />
        )}
      </PopoverPanel>
    </Popover>
  );
};

ButtonDayPickerDesktop.propTypes = {
  value      : PropTypes.instanceOf(Date),
  label      : PropTypes.string,
  onDayChange: PropTypes.func,
};

export default ButtonDayPickerDesktop;
