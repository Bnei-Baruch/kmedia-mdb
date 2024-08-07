import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Button, Message, Popup, Modal, } from 'semantic-ui-react';
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

  const handleOpen        = () => {
    const _url = new URL(url);
    for (const key in properties) {
      _url.searchParams.set(key, properties[key]);
    }

    setUrlWithParams(_url.toString());
    setIsPopupOpen(true);
  };

  const buttonSize = isMobileDevice ? 'tiny' : 'small';
  return (
    <Modal // share bar popup
      className="share-bar"
      on="click"
      flowing
      hideOnScroll
      trigger={
        <ToolbarBtnTooltip
          textKey="share"
          onClick={handleOpen}
          icon={<span className="material-symbols-outlined">share</span>}
        />
      }
      open={isPopupOpen}
      onClose={() => setIsPopupOpen(false)}
      onOpen={handleOpen}
    >
      <Modal.Content>
        <ShareBar
          url={urlWithParams}
          buttonSize={buttonSize}
          messageTitle={t('sources-library.share-title')}
        />
        <Message
          content={urlWithParams}
          size="mini"
          className="share-bar__message text_ellipsis"
        />
        <Popup // link was copied message popup
          open={isCopyOpen}
          content={t('messages.link-copied-to-clipboard')}
          position={`bottom left`}
          trigger={
            (
              <CopyToClipboard text={urlWithParams} onCopy={handleCopied}>
                <Button compact size="small" content={t('buttons.copy')} />
              </CopyToClipboard>
            )
          }
        />
      </Modal.Content>
    </Modal>
  );
};

export default ShareTextModalBtn;
