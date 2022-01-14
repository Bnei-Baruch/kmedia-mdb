import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Header, Icon, Label, Modal, Popup } from 'semantic-ui-react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { withNamespaces } from 'react-i18next';
import Download from '../../shared/Download/Download';
import { MDBFile } from '../../shapes';
import { Splash } from '../../shared/Splash/Splash';
import { relative } from 'patch-package/dist/path';

const CutAndDownload = ({ file, start, end, width, size, t }) => {
  const [download, setDownload]               = useState();
  const [wip, setWip]                         = useState(false);
  const [isCopyPopupOpen, setIsCopyPopupOpen] = useState();

  const handleCut = () => {
    setWip(true);
    console.log(`handleCut 1`);
    fetch(`https://trim.kab.sh/rest/trim?uid=${file.id}&sstart=${start}&send=${end}`)
      .then(r => {
        console.log(`handleCut 2`);
        if (r.ok) return r.json();
        throw Error(r.statusText);
      })
      .then(d => {

        console.log(`handleCut 3`);
        setDownload(d.link);
      })
      .catch(err => {
        console.log(`handleCut err`);
        console.error(err);
      })
      .finally(() => {
        console.log(`handleCut end`);
        setWip(false);
      });
  };

  const handleCopied = () => {
    setIsCopyPopupOpen(true);
  };

  const renderLink = () => (
    <>
      <Header as="h2" content={t('player.download.modalTitle')} />
      <Download
        path={download}
        mimeType={file.mimetype}
        downloadAllowed={true}
        filename={download?.split('/').slice(-1)}
        elId="cut-and-download-button"
        color="orange"
      />
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

  const renderWIP  = () => (
    <>
      <Header as="h2" content={t('player.download.wipTitle')} />
      <Splash isLoading icon="circle notch" color="blue" text={''} />
      <Container content={t('player.download.wipContent')} />
    </>
  );

  return (
    <Modal
      open={!!download || wip}
      onClose={() => setDownload(null)}
      trigger={
        <Button
          circular
          onClick={handleCut}
          disabled={start === end}
          compact
          style={{ width: `${width}px`, height: `${width}px`, position: 'relative' }}
          size="big"
        >
          <Label color="red" floating content={t('new')} />
          <Icon name="cloud download" />
        </Button>
      }
      size="small"
    >
      <Modal.Content className="cut_and_download_modal">
        {
          wip ? renderWIP() : renderLink()
        }
      </Modal.Content>
    </Modal>
  );
};

CutAndDownload.propTypes = {
  file: MDBFile,
  start: PropTypes.string,
  end: PropTypes.string,
  width: PropTypes.number,
  size: PropTypes.string,
};

export default withNamespaces()(CutAndDownload);
