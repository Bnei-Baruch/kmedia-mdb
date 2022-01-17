import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Header, Icon, Label, Modal, Popup } from 'semantic-ui-react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { withNamespaces } from 'react-i18next';

import Download from '../../shared/Download/Download';
import { MDBFile } from '../../shapes';
import Api from '../../../helpers/Api';
import { getSourceErrorSplash, wipLoadingSplash } from '../../shared/WipErr/WipErr';
import { useSelector } from 'react-redux';
import { selectors as settings } from '../../../redux/modules/settings';
import { getLanguageDirection } from '../../../helpers/i18n-utils';

const PORTAL_ELEMENT_ID = 'cut-and-download-button';
const CutAndDownload    = ({ file, sstart, send, width, t }) => {
  const [download, setDownload]               = useState();
  const [wip, setWip]                         = useState(false);
  const [err, setErr]                         = useState(null);
  const [isCopyPopupOpen, setIsCopyPopupOpen] = useState(false);

  const language = useSelector(state => settings.getLanguage(state.settings));
  const dir      = getLanguageDirection(language);

  const isPortalRendered = !!document.getElementById(PORTAL_ELEMENT_ID);

  const handleCut = () => {
    if (sstart === send) return;
    setWip(true);
    setErr(null);
    Api.trimFile({ sstart, send, uid: file.id })
      .then(d => {
        setDownload(d.link);
        setWip(false);
      })
      .catch(err => {
        console.error(err);
        setErr(err);
      });
  };

  const renderDownloadBnt = () => (
    <>
      <Download
        path={download}
        mimeType={file.mimetype}
        downloadAllowed={true}
        filename={download?.split('/').slice(-1)}
        elId={PORTAL_ELEMENT_ID}
        color="orange"
        beforeClick={() => setWip(true)}
        afterLoaded={() => setWip(false)}
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
        <CopyToClipboard text={download} onCopy={() => setIsCopyPopupOpen(true)}>
          <Button color="orange" size="mini" content={t('buttons.copy')} />
        </CopyToClipboard>
      )}
    />
  );

  const renderContent = () => {
    const title   = wip ? t('player.download.wipTitle') : t('player.download.modalTitle');
    const content = wip ? t('player.download.wipContent') : t('player.download.modalContent');
    return (
      <Modal.Content className="cut_and_download_modal">
        <Header as="h2" color="grey" content={title} />
        {
          !!err ? getSourceErrorSplash(err, t) : (wip || !isPortalRendered) && wipLoadingSplash(t)
        }
        {
          download && renderDownloadBnt()
        }
        {
          isPortalRendered && renderCopyBtn()
        }

        <Container content={content} />
      </Modal.Content>
    );
  };

  return (
    <Modal
      open={!!download || wip}
      onClose={() => setDownload(null)}
      size="tiny"
      dir={dir}
      trigger={
        <Popup
          content={t('player.download.iconHoverText')}
          position="top center"
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
