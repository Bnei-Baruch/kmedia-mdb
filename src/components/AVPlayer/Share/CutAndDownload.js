import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Header, Icon, Label, Modal, Popup } from 'semantic-ui-react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { withNamespaces } from 'react-i18next';

import Download from '../../shared/Download/Download';
import { MDBFile } from '../../shapes';
import Api from '../../../helpers/Api';
import WipErr from '../../shared/WipErr/WipErr';

const CutAndDownload = ({ file, sstart, send, width, t }) => {
  const [download, setDownload]               = useState();
  const [wip, setWip]                         = useState(false);
  const [err, setErr]                         = useState(null);
  const [isCopyPopupOpen, setIsCopyPopupOpen] = useState();

  const wipErr = WipErr({ wip, err, t });

  const handleCut = () => {
    if (sstart === send) return;
    setWip(true);
    setErr(null);
    Api.trimFile({ sstart, send, uid: file.id })
      .then(d => {
        setDownload(d.link);
      })
      .catch(err => {
        console.error(err);
        setErr(err);
      })
      .finally(() => {
        setWip(false);
      });
  };

  const handleCopied = () => {
    setIsCopyPopupOpen(true);
  };

  const renderLink = () => (
    <>
      <Header as="h2" color="grey" content={t('player.download.modalTitle')} />
      <Download
        path={download}
        mimeType={file.mimetype}
        downloadAllowed={true}
        filename={download?.split('/').slice(-1)}
        elId="cut-and-download-button"
        color="orange"
      >
        {t('player.download.downloadButton')}
      </Download>
      {/* a portal is used to put the download button here in this div */}
      <span id="cut-and-download-button" />
      <Popup
        open={isCopyPopupOpen}
        content={t('messages.link-copied-to-clipboard')}
        position="bottom right"
        trigger={(
          <CopyToClipboard text={download} onCopy={handleCopied}>
            <Button color="orange" size="mini" content={t('buttons.copy')} />
          </CopyToClipboard>
        )}
      />
      <Container content={t('player.download.modalContent')} />
    </>
  );

  const renderWIP = () => (
    <>
      <Header as="h2" color="grey" content={t('player.download.wipTitle')} />
      {wipErr}
      <Container content={t('player.download.wipContent')} />
    </>
  );

  return (
    <Modal
      open={!!download || wip}
      onClose={() => setDownload(null)}
      size="tiny"
      trigger={
        <Popup
          hoverable
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
              <Label color="red" floating content={t('messages.new')} />
              <Icon name="cloud download" />
            </Button>
          }
        />
      }
    >
      <Modal.Content className="cut_and_download_modal">
        {
          wipErr ? renderWIP() : renderLink()
        }
      </Modal.Content>
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
