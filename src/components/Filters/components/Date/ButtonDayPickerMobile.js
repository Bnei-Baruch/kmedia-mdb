import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { Dialog, DialogPanel } from '@headlessui/react';
import { clsx } from 'clsx';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import { today } from '../../../../helpers/date';
import { noop } from '../../../../helpers/utils';
import { selectors as settings } from '../../../../redux/modules/settings';
import Icon from '../../../Icon';

const ButtonDayPickerMobile = ({ value = null, label = '', onDayChange = noop, withLabel }) => {
  const { t } = useTranslation();
  const uiDir = useSelector(state => settings.getUIDir(state.settings));
  const { isIOS, isAndroid } = useContext(DeviceInfoContext);

  const [selectedDate, setSelectedDate]         = useState(null);
  const [isNativePopupOpen, setNativePopupOpen] = useState(false);

  const nativeDateInputRef = useRef();
  const localeDateFormat   = useMemo(() => moment.localeData().longDateFormat('L'), []);

  const openNativeDatePicker = useCallback(() => {
    if (isAndroid) {
      nativeDateInputRef.current?.click();
      return;
    }

    nativeDateInputRef.current?.focus();
  }, [isAndroid]);

  const handleNativeDateInputChange = useCallback(event => {
    const date = event.target.valueAsDate;
    setSelectedDate(date);
    if (!isIOS) {
      onDayChange(date);
    }
  }, [isIOS, onDayChange]);

  const applySelectedDate = useCallback(() => {
    onDayChange(selectedDate || value || today().toDate());
  }, [selectedDate, value, onDayChange]);

  const selected         = selectedDate || value;
  const selectedToString = selected ? moment(selected).format('YYYY-MM-DD') : '';

  const dateButton = (
    <button
      className={clsx('dateButton inline-flex items-center px-2 py-2 font-bold bg-gray-200 text-gray-700 rounded cursor-pointer hover:bg-gray-300', { 'dateButton_with_label': withLabel })}
      onClick={openNativeDatePicker}
    >
      <Icon icon={faCalendarDays} className="text-lg" />
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
    </button>
  );

  if (!isIOS) {
    return dateButton;
  }

  const selectedInLocaleFormat = moment(selected).format(localeDateFormat);
  return (
    <>
      <div onClick={() => setNativePopupOpen(true)}>
        {dateButton}
      </div>
      <Dialog open={isNativePopupOpen} onClose={() => setNativePopupOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-white rounded-lg shadow-xl p-4 w-full max-w-md" dir={uiDir}>
            <div className="flex items-center gap-2">
              <input
                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                readOnly
                value={selectedInLocaleFormat}
                onClick={openNativeDatePicker}
              />
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm whitespace-nowrap"
                onClick={applySelectedDate}
              >
                {t('buttons.apply')}
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm whitespace-nowrap"
                onClick={() => setNativePopupOpen(false)}
              >
                {t('buttons.cancel')}
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

ButtonDayPickerMobile.propTypes = {
  value      : PropTypes.instanceOf(Date),
  label      : PropTypes.string,
  onDayChange: PropTypes.func,
  withLabel  : PropTypes.bool,
};

export default ButtonDayPickerMobile;
