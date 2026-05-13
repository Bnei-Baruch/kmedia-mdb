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
    <div className="flex flex-1 items-stretch" dir={uiDir}>
      <input
        className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-l border-r-0"
        dir="ltr"
        value={shareUrl}
        readOnly
      />
      <Popover className="relative">
        <CopyToClipboard text={shareUrl} onCopy={handleCopied}>
          <span className="h-full right-0 button rounded-l-none border-l-0 text-xs" >
            {t('buttons.copy')}
          </span>
        </CopyToClipboard>
        {open && (
          <PopoverPanel static className="absolute z-10 mt-1 bg-gray-800 text-white text-xs rounded py-1 px-2" dir={uiDir}>
            {t('messages.link-copied-to-clipboard')}
          </PopoverPanel>
        )}
      </Popover>
    </div>
  );
};

export default CopyShareUrl;
