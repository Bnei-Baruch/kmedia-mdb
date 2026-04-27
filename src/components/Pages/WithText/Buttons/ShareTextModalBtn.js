import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Dialog } from '@headlessui/react';
import { useSelector } from 'react-redux';

import ShareBar from '../../../Share/ShareBar';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import useStateWithCallback from '../../../../helpers/use-state-with-callback';

import { textPageGetUrlInfoSelector } from '../../../../redux/selectors';
import ToolbarBtnTooltip from './ToolbarBtnTooltip';
import { POPOVER_CONFIRMATION_TIMEOUT } from '../../../../helpers/consts';


const ShareTextModalBtn = () => {
  const { t }                         = useTranslation();
  const { isMobileDevice }            = useContext(DeviceInfoContext);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isCopyOpen, setIsCopyOpen]   = useStateWithCallback(false, isCopyOpen => {
    if (isCopyOpen) {
      timeout = setTimeout(() => setIsCopyOpen(false), POPOVER_CONFIRMATION_TIMEOUT);
    }
  });

  const { select, search, url } = useSelector(textPageGetUrlInfoSelector);

  const properties = { ...select, ...search };

  const [urlWithParams, setUrlWithParams] = useState(url);

  let timeout = undefined;

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

  const handleOpen = () => {
    const _url = new URL(url);
    for (const key in properties) {
      _url.searchParams.set(key, properties[key]);
    }

    setUrlWithParams(_url.toString());
    setIsPopupOpen(true);
  };

  const buttonSize = isMobileDevice ? 'tiny' : 'small';
  return (
    <>
      <ToolbarBtnTooltip
        textKey="share"
        onClick={handleOpen}
        icon={<span className="material-symbols-outlined">share</span>}
      />
      <Dialog
        open={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        className="share-bar relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="mx-auto max-w-md rounded bg-white p-6">
            <ShareBar
              url={urlWithParams}
              buttonSize={buttonSize}
              messageTitle={t('sources-library.share-title')}
            />
            <div className="share-bar__message text_ellipsis rounded bg-blue-50 p-2 small mt-2">
              {urlWithParams}
            </div>
            <div className="relative inline-block mt-2">
              <CopyToClipboard text={urlWithParams} onCopy={handleCopied}>
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
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default ShareTextModalBtn;
