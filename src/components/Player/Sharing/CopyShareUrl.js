import React, { useState } from 'react';
import { Popover, PopoverPanel } from '@headlessui/react';
import CopyToClipboard from 'react-copy-to-clipboard';
import useShareUrl from '../hooks/useShareUrl';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { settingsGetUIDirSelector } from '../../../redux/selectors';
import { POPOVER_CONFIRMATION_TIMEOUT } from '../../../helpers/consts';

let timeout;
const CopyShareUrl = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const uiDir = useSelector(settingsGetUIDirSelector);

  const handleCopied = () => {
    clearTimeout(timeout);
    setOpen(true);
    timeout = setTimeout(() => setOpen(false), POPOVER_CONFIRMATION_TIMEOUT);
  };

  const shareUrl = useShareUrl();

  return (
    <div className="flex w-full" dir={uiDir}>
      <input
        className="flex-1 min-w-0 px-2 py-1 small border border-gray-300 rounded-l"
        dir="ltr"
        value={shareUrl}
        readOnly
      />
      <Popover className="relative">
        <CopyToClipboard text={shareUrl} onCopy={handleCopied}>
          <button className="px-3 py-1 small bg-gray-100 border border-gray-300 border-l-0 rounded-r whitespace-nowrap">
            {t('buttons.copy')}
          </button>
        </CopyToClipboard>
        {open && (
          <PopoverPanel
            static
            className="absolute top-full right-0 mt-2 rounded bg-gray-900 px-2 py-1 text-xs text-white whitespace-nowrap z-10"
          >
            {t('messages.link-copied-to-clipboard')}
          </PopoverPanel>
        )}
      </Popover>
    </div>
  );
};

export default CopyShareUrl;
