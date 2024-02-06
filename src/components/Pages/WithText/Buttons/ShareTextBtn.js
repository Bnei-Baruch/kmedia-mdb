import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Button, Message, Popup, } from 'semantic-ui-react';

import ShareBar from '../../../Share/ShareBar';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import useStateWithCallback from '../../../../helpers/use-state-with-callback';
import { useSelector } from 'react-redux';
import { textPageGetUrlInfoSelector } from '../../../../redux/selectors';
import TooltipForWeb from '../../../shared/TooltipForWeb';

const POPOVER_CONFIRMATION_TIMEOUT = 2500;

const ShareTextBtn = () => {
  const { t }              = useTranslation();
  const { isMobileDevice } = useContext(DeviceInfoContext);

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

  const buttonSize = isMobileDevice ? 'tiny' : 'small';

  return (
    <Popup // share bar popup
      className="share-bar"
      on="click"
      flowing
      hideOnScroll
      trigger={
        <div>
          <TooltipForWeb
            text={t('page-with-text.buttons.share')}
            trigger={<Button icon={<span className="material-symbols-outlined">share</span>} />}
          />
        </div>
      }
      open={isPopupOpen}
      onClose={() => setIsPopupOpen(false)}
      onOpen={() => {
        const _url = new URL(url);
        for (const key in properties) {
          _url.searchParams.set(key, properties[key]);
        }

        setUrlWithParams(_url.toString());
        setIsPopupOpen(true);
      }}
    >
      <Popup.Content>
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
          trigger={
            (
              <CopyToClipboard text={urlWithParams} onCopy={handleCopied}>
                <Button compact size="small" content={t('buttons.copy')} />
              </CopyToClipboard>
            )
          }
        />
      </Popup.Content>
    </Popup>
  );
};

export default ShareTextBtn;
