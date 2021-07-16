import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Popup } from 'semantic-ui-react';
import { isLanguageRtl } from '../../helpers/i18n-utils';
import { Reference } from '../shapes';

const POPOVER_CONFIRMATION_TIMEOUT = 2500;

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
    }
  }, [openOnInit, timeout, updateTrigger])

  const rtlLang = isLanguageRtl(language);

  return (
    <Popup
      open={opened}
      content={message}
      position={`${downward ? 'bottom' : 'top'} right`}
      className={rtlLang ? 'change-popup-direction' : ''}
      context={refElement}
    />
  );
}

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
