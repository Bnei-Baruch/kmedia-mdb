import React, { useState, useContext } from 'react';
import { faDownload, faCopy } from '@fortawesome/free-solid-svg-icons';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { withTranslation } from 'react-i18next';
import CopyToClipboard from 'react-copy-to-clipboard';
import { DeviceInfoContext } from '../../helpers/app-contexts';
import Icon from '../Icon';
import { POPOVER_CONFIRMATION_TIMEOUT } from '../../helpers/consts';

const DownloadTrimItem = ({ item, pos, t }) => {
  const [open, setOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const { link, download, name } = item;
  const { isMobileDevice }       = useContext(DeviceInfoContext);

  const handleCopy = () => {
    setOpen(true);
    setTimeout(() => setOpen(false), POPOVER_CONFIRMATION_TIMEOUT);
  };

  return (
    <div className="flex" key={`file_${pos}`}>
      <div className={isMobileDevice ? 'flex-[11]' : 'flex-[13]'}>
        {`${pos}. ${name}`}
      </div>
      <div className={`${isMobileDevice ? 'flex-[5]' : 'flex-[3]'} text-right`}>
        <Popover className="relative inline-block">
          <PopoverButton
            as="div"
            className="inline-block cursor-default"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <a
              href={download}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center px-2 py-1 border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
            >
              <Icon icon={faDownload} />
            </a>
          </PopoverButton>
          {showTooltip && (
            <PopoverPanel
              static
              className="absolute z-50 bottom-full mb-1 left-1/2 -translate-x-1/2 rounded bg-gray-800 text-white shadow-lg px-2 py-1 text-xs whitespace-nowrap"
            >
              {t('player.download.download-button')}
            </PopoverPanel>
          )}
        </Popover>
        <Popover className="relative inline-block">
          <PopoverButton as="div" className="inline-block">
            <CopyToClipboard text={link} onCopy={handleCopy}>
              <button
                className="inline-flex items-center justify-center px-2 py-1 border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
              >
                <Icon icon={faCopy} />
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
      </div>
    </div>
  );
};

export default withTranslation()(DownloadTrimItem);
