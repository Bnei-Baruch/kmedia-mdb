import React, { useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Button, Message, Popup, } from 'semantic-ui-react';

import ShareBar from '../AVPlayer/Share/ShareBar';
import { DeviceInfoContext } from '../../helpers/app-contexts';
import useStateWithCallback from '../../helpers/use-state-with-callback';

const POPOVER_CONFIRMATION_TIMEOUT = 2500;

const LibraryShare = ({ t, url }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const contextRef = useRef();

  const [isCopyOpen, setIsCopyOpen] = useStateWithCallback(false, isCopyOpen => {
    if (isCopyOpen) {
      timeout = setTimeout(() => setIsCopyOpen(false), POPOVER_CONFIRMATION_TIMEOUT);
    }
  });

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

  const render = () => {
    const buttonSize = isMobileDevice ? 'tiny' : 'small';

    return (
      <>
        <div className="search-on-page--bar-position" ref={contextRef}></div>

        <Popup // share bar popup
          className="share-bar search-on-page--share-bar"
          context={contextRef}
          basic
          position={`bottom left`}
          trigger={<div />}
          open
        >
          <Popup.Content>
            <ShareBar url={url} buttonSize={buttonSize} messageTitle={t('share-text.message-title')} className="search-on-page--share-bar" />
            <Message content={url} size="mini" />
            <Popup // link was copied message popup
              open={isCopyOpen}
              content={t('messages.link-copied-to-clipboard')}
              position={`bottom left`}
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
      </>
    );
  };

  return render();
};

LibraryShare.propTypes = {
  t: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
};

export default withNamespaces()(LibraryShare);
