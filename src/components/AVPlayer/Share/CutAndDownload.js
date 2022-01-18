import React, { useContext, useState } from 'react';
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
import { DownloadNoPortal } from '../../shared/Download/Download';
import { DeviceInfoContext } from '../../../helpers/app-contexts';

const CutAndDownload = ({ file, sstart, send, width, t }) => {
  const [open, setOpen]                       = useState(false);
  const [openIconHover, setOpenIconHover]     = useState(false);
  const [isCopyPopupOpen, setIsCopyPopupOpen] = useState(false);

  const { wip, err, url } = useSelector(state => selectors.getTrimFile(state.assets)) || {};

  const language = useSelector(state => settings.getLanguage(state.settings));
  const dir      = getLanguageDirection(language);

  const deviceInfoContext = useContext(DeviceInfoContext);
  const downloadAllowed   = deviceInfoContext.deviceInfo?.os.name !== 'iOS';

  const dispatch  = useDispatch();
  const handleCut = () => {
    if (sstart === send) {
      return;
    }

    setOpen(true);
    dispatch(actions.trimFile({ sstart, send, uid: file.id }));
  };

  const clear = () => {
    dispatch(actions.clearTrimFile());
    setOpen(false);
  };

  const renderDownloadBnt = () => (
    <>
      <DownloadNoPortal
        path={url}
        mimeType={file.mimetype}
        onLoadStart={clear}
        color="orange"
        downloadAllowed={downloadAllowed}
      >
        {t('player.download.downloadButton')}
      </DownloadNoPortal>

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
    const title   = wip ? t('player.download.wipTitle') : t('player.download.modalTitle');
    const content = wip ? t('player.download.wipContent') : t('player.download.modalContent');
    return (
      <Modal.Content className="cut_and_download_modal">
        <Header as="h2" color="grey" content={title} />
        {
          !!err ? getSourceErrorSplash(err, t) : wip && wipLoadingSplash(t)
        }
        {
          url && renderDownloadBnt()
        }
        {
          url && renderCopyBtn()
        }

        <Container content={content} />
      </Modal.Content>
    );
  };

  return (
    <Modal
      open={open}
      onClose={clear}
      size="tiny"
      dir={dir}
      trigger={
        <Popup
          open={openIconHover && !open}
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
