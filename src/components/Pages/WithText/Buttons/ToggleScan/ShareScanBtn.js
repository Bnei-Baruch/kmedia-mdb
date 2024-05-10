import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Button, Message, Popup, } from 'semantic-ui-react';
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
  if (!!url) {
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
    <Popup // share bar popup
      className="share-bar"
      on="click"
      flowing
      hideOnScroll
      trigger={
        <ScanBtnTpl
          icon="share"
          textKey="share"
        />
      }
    >
      <Popup.Content>
        <ShareBar
          url={url}
          buttonSize={buttonSize}
          messageTitle={t('sources-library.share-title')}
        />
        <Message
          content={url}
          size="mini"
          className="share-bar__message text_ellipsis"
        />
        <Popup // link was copied message popup
          open={isCopyOpen}
          content={t('messages.link-copied-to-clipboard')}
          trigger={
            (
              <CopyToClipboard text={url} onCopy={handleCopied}>
                <Button compact size="small" content={t('buttons.copy')}/>
              </CopyToClipboard>
            )
          }
        />
      </Popup.Content>
    </Popup>
  );
};

export default ShareScanBtn;
