import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import DayPicker from 'react-day-picker';
import Navbar from 'react-day-picker/build/Navbar';
import 'react-day-picker/lib/style.css';
import MomentLocaleUtils from 'react-day-picker/moment';
import { useSelector } from 'react-redux';

import { today } from '../../../../helpers/date';
import { getLanguageLocaleWORegion } from '../../../../helpers/i18n-utils';
import { noop } from '../../../../helpers/utils';
import { selectors as settings } from '../../../../redux/modules/settings';
import Icon from '../../../Icon';
import YearMonthForm from './YearMonthForm';

const ButtonDayPickerDesktop = ({ value = null, label = '', onDayChange = noop }) => {
  const uiLang = useSelector(state => settings.getUILang(state.settings));
  const uiDir  = useSelector(state => settings.getUIDir(state.settings));

  const [month, setMonth] = useState(value);
  const locale = useMemo(() => getLanguageLocaleWORegion(uiLang), [uiLang]);

  useEffect(() => setMonth(value), [value]);

  const handleYearMonthChange = useCallback(m => setMonth(m), []);

  const getNavBarElement = useCallback(props => {
    const { month: navMonth, localeUtils } = props;
    return (
      <div>
        <Navbar {...props} className="ButtonDayPicker-DayPicker-NavButton" />
        <YearMonthForm
          date={navMonth}
          uiLang={uiLang}
          localeUtils={localeUtils}
          onChange={handleYearMonthChange}
          className="float-left"
        />
        <div className="clear" />
      </div>
    );
  }, [uiLang, handleYearMonthChange]);

  const handleDayClick = useCallback((date, close) => {
    if (date > today().add(1, 'days').toDate()) return;
    onDayChange(date);
    close();
  }, [onDayChange]);

  return (
    <Popover className="relative inline-block">
      <PopoverButton className="dateButton inline-flex items-center px-4 py-2 font-bold bg-gray-200 text-gray-700 rounded cursor-pointer hover:bg-gray-300">
        <Icon icon={faCalendarDays} className="mr-1.5" />
        {label}
      </PopoverButton>
      <PopoverPanel className="absolute z-50 mt-1 bg-white border border-gray-200 rounded shadow-lg p-4" dir={uiDir}>
        {({ close }) => (
          <DayPicker
            locale={locale}
            localeUtils={MomentLocaleUtils}
            disabledDays={{ after: new Date() }}
            captionElement={() => null}
            navbarElement={getNavBarElement}
            month={month}
            toMonth={today().toDate()}
            onDayClick={date => handleDayClick(date, close)}
            selectedDays={value}
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
