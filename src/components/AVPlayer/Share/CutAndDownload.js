import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Header, Icon, Label, Modal, Popup } from 'semantic-ui-react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useDispatch, useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import { selectors as settings } from '../../../redux/modules/settings';
import { actions, selectors } from '../../../redux/modules/assets';
import { getLanguageDirection } from '../../../helpers/i18n-utils';
import { getSourceErrorSplash, wipLoadingSplash } from '../../shared/WipErr/WipErr';
import { MDBFile } from '../../shapes';
import Download from '../../shared/Download/Download';

const PORTAL_ELEMENT_ID = 'cut-and-download-button';

const CutAndDownload = ({ file, sstart, send, width, t }) => {
  const [wipFetch, setWipFetch]                 = useState(false);
  const [openIconHover, setOpenIconHover]       = useState(false);
  const [isCopyPopupOpen, setIsCopyPopupOpen]   = useState(false);
  const [isPortalRendered, setIsPortalRendered] = useState(false);

  const { wip, err, url } = useSelector(state => selectors.getTrimFile(state.assets)) || {};

  const language = useSelector(state => settings.getLanguage(state.settings));
  const dir      = getLanguageDirection(language);

  const dispatch  = useDispatch();
  const handleCut = () => {
    if (sstart === send) {
      return;
    }
    dispatch(actions.trimFile({ sstart, send, uid: file.id }));
  };

  const clear = () => {
    dispatch(actions.clearTrimFile());
    setWipFetch(false);
    setIsPortalRendered(false);
  };

  const handleDidMount = () => {
    setIsPortalRendered(true);
  };

  const renderDownloadBnt = () => (
    <>
      <Download
        path={url}
        mimeType={file.mimetype}
        downloadAllowed={true}
        filename={url?.split('/').slice(-1)}
        elId={PORTAL_ELEMENT_ID}
        color="orange"
        beforeClick={() => setWipFetch(true)}
        afterLoaded={() => setWipFetch(false)}
        handleDidMount={handleDidMount}
      >
        {t('player.download.downloadButton')}
      </Download>
      {/* a portal is used to put the download button here in this div */}
      <span id={PORTAL_ELEMENT_ID} />
    </>
  );

  const renderCopyBtn = () => (
    <Popup
      open={isCopyPopupOpen}
      onClose={() => setIsCopyPopupOpen(false)}
      content={t('messages.link-copied-to-clipboard')}
      position="bottom right"
      trigger={(
        <CopyToClipboard text={url} onCopy={() => setIsCopyPopupOpen(true)}>
          <Button color="orange" size="mini" content={t('buttons.copy')} />
        </CopyToClipboard>
      )}
    />
  );

  const renderContent = () => {
    const title   = (wip || wipFetch) ? t('player.download.wipTitle') : t('player.download.modalTitle');
    const content = (wip || wipFetch) ? t('player.download.wipContent') : t('player.download.modalContent');
    return (
      <Modal.Content className="cut_and_download_modal">
        <Header as="h2" color="grey" content={title} />
        {
          !!err ? getSourceErrorSplash(err, t) : (wip || wipFetch || !isPortalRendered) && wipLoadingSplash(t)
        }
        {
          url && renderDownloadBnt()
        }
        {
          isPortalRendered && renderCopyBtn()
        }

        <Container content={content} />
      </Modal.Content>
    );
  };
  const mOpen         = !!url || wip || wipFetch;
  return (
    <Modal
      open={mOpen}
      onClose={clear}
      size="tiny"
      dir={dir}
      trigger={
        <Popup
          open={openIconHover && !(mOpen)}
          onOpen={() => setOpenIconHover(true)}
          onClose={() => setOpenIconHover(false)}
          content={t('player.download.iconHoverText')}
          position={'top right'}
          trigger={
            <Button
              circular
              onClick={handleCut}
              compact
              style={{ width: `${width}px`, height: `${width}px` }}
              size="big"
              className="cut_and_download_btn"
            >
              <Label
                color="red"
                floating
                content={t('messages.new')}
              />
              <Icon name="cloud download" />
            </Button>
          }
        />
      }
    >
      {renderContent()}
    </Modal>
  );
};

CutAndDownload.propTypes = {
  file: MDBFile,
  sstart: PropTypes.string,
  send: PropTypes.string,
  width: PropTypes.number
};

export default withNamespaces()(CutAndDownload);
