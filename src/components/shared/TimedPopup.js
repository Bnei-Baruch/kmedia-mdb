import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Popover, PopoverPanel } from '@headlessui/react';
import { isLanguageRtl } from '../../helpers/i18n-utils';
import { Reference } from '../shapes';
import { POPOVER_CONFIRMATION_TIMEOUT } from '../../helpers/consts';

const TimedPopup = ({
  message,
  downward = false,
  openOnInit = false,
  timeout = POPOVER_CONFIRMATION_TIMEOUT,
  language,
  refElement = null,
  updateTrigger }) => {

  const [opened, setOpened] = useState(false);

  useEffect(() => {
    let confirmTimeoutHandle = null;

    const clearConfirmationTimeout = () => {
      if (confirmTimeoutHandle) {
        clearTimeout(confirmTimeoutHandle);
        confirmTimeoutHandle = null;
      }
    };

    if (openOnInit) {
      clearConfirmationTimeout();
      setOpened(true);
      confirmTimeoutHandle = setTimeout(() => setOpened(false), timeout);
    } else {
      setOpened(false);
    }

    return () => {
      clearConfirmationTimeout();
    };
  }, [openOnInit, timeout, updateTrigger]);

  const rtlLang = isLanguageRtl(language);

  if (!opened) return null;

  return (
    <Popover as="div" className="relative inline-block">
      <PopoverPanel
        static
        className={`absolute z-50 rounded bg-white shadow-lg border border-gray-200 px-3 py-2 small whitespace-nowrap ${downward ? 'top-full mt-1' : 'bottom-full mb-1'} right-0 ${rtlLang ? 'change-popup-direction' : ''}`}
      >
        {message}
      </PopoverPanel>
    </Popover>
  );
};

TimedPopup.propTypes = {
  message: PropTypes.string.isRequired,
  downward: PropTypes.bool,
  openOnInit: PropTypes.bool,
  timeout: PropTypes.number,
  language: PropTypes.string.isRequired,
  refElement: Reference,
  updateTrigger: PropTypes.string
};

export default TimedPopup;
