import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { POPOVER_CONFIRMATION_TIMEOUT } from '../../helpers/consts';
import Icon from '../Icon';

const getEmbed = url => {
  const appendChar = url.indexOf('?') !== -1 ? '&' : '?';
  return `<iframe width="680" height="420" src="${url}${appendChar}embed=1&autoPlay=1" frameBorder="0" scrolling="no" allowfullscreen />`;
};

let timeout;

const clear = () => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
};

const EmbeddedShareButton = ({ url = '' }) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const handleCopied = () => {
    clear();
    setOpen(true);
    timeout = setTimeout(() => setOpen(false), POPOVER_CONFIRMATION_TIMEOUT);
  };

  return (
    <Popover className="relative inline-block">
      <PopoverButton as="div">
        <CopyToClipboard text={getEmbed(url)} onCopy={handleCopied}>
          <button className="custom_share_button">
            <span className="custom_share_button inline-flex items-center justify-center rounded-full p-2">
              <Icon icon={faCode} />
            </span>
          </button>
        </CopyToClipboard>
      </PopoverButton>
      {open && (
        <PopoverPanel
          static
          className="absolute z-50 top-full mt-1 right-0 rounded bg-white shadow-lg border border-gray-200 px-3 py-2 small whitespace-nowrap"
        >
          {t('messages.link-copied-to-clipboard')}
        </PopoverPanel>
      )}
    </Popover>
  );
};

export default EmbeddedShareButton;
