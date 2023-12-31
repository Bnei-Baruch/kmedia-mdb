import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withTranslation, useTranslation } from 'react-i18next';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Button, Message, Popup, } from 'semantic-ui-react';

import ShareBar from '../../../Share/ShareBar';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import useStateWithCallback from '../../../../helpers/use-state-with-callback';
import { useSelector } from 'react-redux';
import { selectors as textPage } from '../../../../redux/modules/textPage';
import clsx from 'clsx';

const POPOVER_CONFIRMATION_TIMEOUT = 2500;

const ShareTextBtn = () => {
  const { t }                         = useTranslation();
  const { isMobileDevice }            = useContext(DeviceInfoContext);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isCopyOpen, setIsCopyOpen]   = useStateWithCallback(false, isCopyOpen => {
    if (isCopyOpen) {
      timeout = setTimeout(() => setIsCopyOpen(false), POPOVER_CONFIRMATION_TIMEOUT);
    }
  });

  const { select: properties, url } = useSelector(state => textPage.getUrlInfo(state.textPage));

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
        <Button
          size="small"
          icon={
            <span className="material-symbols-outlined">share</span>
          }
        />
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
          position={`bottom left`}
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
