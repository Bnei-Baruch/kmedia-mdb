import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Button, Message, Popup, } from 'semantic-ui-react';

import ShareBar from '../../AVPlayer/Share/ShareBar';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import useStateWithCallback from '../../../helpers/use-state-with-callback';

const POPOVER_CONFIRMATION_TIMEOUT = 2500;

const LibraryShare = ({ t, position }) => {
  const { isMobileDevice }            = useContext(DeviceInfoContext);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isCopyOpen, setIsCopyOpen]   = useStateWithCallback(false, isCopyOpen => {
    if (isCopyOpen) {
      timeout = setTimeout(() => setIsCopyOpen(false), POPOVER_CONFIRMATION_TIMEOUT);
    }
  });

  let timeout = undefined;

  useEffect(() => {
    window.addEventListener('resize', closePopup);
  }, []);

  useEffect(() => {
    return () => {
      window.removeEventListener('resize', closePopup);
    };
  }, []);

  const closePopup = () => {
    setIsPopupOpen(false);
  };

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

  const render = () => {
    let url;
    if (isPopupOpen) {
      url = window.location.href;  // shouldn't be called during SSR
    }

    const buttonSize = isMobileDevice ? 'tiny' : 'small';

    return (
      <Popup // share bar popup
        className="share-bar"
        on="click"
        flowing
        hideOnScroll
        position={`bottom ${position}`}
        trigger={<Button compact size="small" icon="share alternate" />}
        open={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onOpen={() => setIsPopupOpen(true)}
      >
        <Popup.Content>
          <ShareBar url={url} buttonSize={buttonSize} messageTitle={t('sources-library.share-title')} />
          <Message content={url} size="mini" />
          <Popup // link was copied message popup
            open={isCopyOpen}
            content={t('messages.link-copied-to-clipboard')}
            position={`bottom ${position}`}
            trigger={
              (
                <CopyToClipboard text={url} onCopy={handleCopied}>
                  <Button compact size="small" content={t('buttons.copy')} />
                </CopyToClipboard>
              )
            }
          />
        </Popup.Content>
      </Popup>
    );
  };

  return render();
};

LibraryShare.propTypes = {
  t: PropTypes.func.isRequired,
  position: PropTypes.string.isRequired,
};

export default withNamespaces()(LibraryShare);
