import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Popover } from '@headlessui/react';
import { useSelector } from 'react-redux';

import ShareBar from '../../../../Share/ShareBar';
import { DeviceInfoContext } from '../../../../../helpers/app-contexts';
import useStateWithCallback from '../../../../../helpers/use-state-with-callback';
import { textPageGetUrlInfoSelector } from '../../../../../redux/selectors';
import { POPOVER_CONFIRMATION_TIMEOUT } from '../../../../../helpers/consts';
import ScanBtnTpl from './ScanBtnTpl';

let timeout;
const ShareScanBtn = () => {
  const { t }              = useTranslation();
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const [isCopyOpen, setIsCopyOpen] = useStateWithCallback(false, isCopyOpen => {
    if (isCopyOpen) {
      timeout = setTimeout(() => setIsCopyOpen(false), POPOVER_CONFIRMATION_TIMEOUT);
    }
  });

  let { url } = useSelector(textPageGetUrlInfoSelector);
  if (url) {
    const _url = new URL(url);
    _url.searchParams.set('scan', true);
    url = _url.toString();
  }

  const handleCopied = () => {
    clearPopupTimeout();
    setIsCopyOpen(true);
  };

  const clearPopupTimeout = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  const buttonSize = isMobileDevice ? 'tiny' : 'small';

  return (
    <Popover className="share-bar relative">
      <Popover.Button as="div">
        <ScanBtnTpl
          icon="share"
          textKey="share"
        />
      </Popover.Button>
      <Popover.Panel className="absolute z-10 mt-2">
        <ShareBar
          url={url}
          buttonSize={buttonSize}
          messageTitle={t('sources-library.share-title')}
        />
        <div className="share-bar__message text_ellipsis rounded bg-blue-50 p-2 small mt-2">
          {url}
        </div>
        <div className="relative inline-block mt-2">
          <CopyToClipboard text={url} onCopy={handleCopied}>
            <button className="px-3 py-1 small rounded border border-gray-300 hover:bg-gray-50">
              {t('buttons.copy')}
            </button>
          </CopyToClipboard>
          {isCopyOpen && (
            <div className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 rounded bg-gray-800 px-3 py-1 small text-white whitespace-nowrap">
              {t('messages.link-copied-to-clipboard')}
            </div>
          )}
        </div>
      </Popover.Panel>
    </Popover>
  );
};

export default ShareScanBtn;
