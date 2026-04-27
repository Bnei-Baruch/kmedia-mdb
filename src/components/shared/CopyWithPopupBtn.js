import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';

import useStateWithCallback from '../../helpers/use-state-with-callback';
import { useTranslation } from 'react-i18next';
import { POPOVER_CONFIRMATION_TIMEOUT } from '../../helpers/consts';

const CopyWithPopupBtn = ({ text, children }) => {
  const { t }           = useTranslation();
  const [open, setOpen] = useStateWithCallback(false, open => {
    if (open) {
      timeout = setTimeout(() => setOpen(false), POPOVER_CONFIRMATION_TIMEOUT);
    }
  });

  let timeout = undefined;

  const handleCopied = () => {
    clearPopupTimeout();
    setOpen(true);
  };

  const clearPopupTimeout = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return (
    <Popover className="relative inline-block">
      <PopoverButton as="div">
        <CopyToClipboard text={text} onCopy={handleCopied}>
          {children}
        </CopyToClipboard>
      </PopoverButton>
      {open && (
        <PopoverPanel
          static
          className="absolute z-50 top-full mt-1 left-0 rounded bg-white shadow-lg border border-gray-200 px-3 py-2 small whitespace-nowrap"
        >
          {t('messages.link-copied-to-clipboard')}
        </PopoverPanel>
      )}
    </Popover>
  );
};

export default CopyWithPopupBtn;
