import React, { useState, useContext } from 'react';
import { Button, GridColumn, GridRow, Popup } from 'semantic-ui-react';
import { withTranslation } from 'react-i18next';
import CopyToClipboard from 'react-copy-to-clipboard';
import { DeviceInfoContext } from '../../helpers/app-contexts';

const DownloadTrimItem = ({ item, pos, t }) => {
  const [open, setOpen] = useState(false);

  const { link, download, name } = item;
  const { isMobileDevice }       = useContext(DeviceInfoContext);
  return (
    <GridRow key={`file_${pos}`}>
      <GridColumn width={isMobileDevice ? 11 : 13}>
        {`${pos}. ${name}`}
      </GridColumn>
      <GridColumn width={isMobileDevice ? 5 : 3} textAlign="right">
        <Popup
          content={t('player.download.download-button')}
          trigger={
            <Button
              as="a"
              basic
              compact
              size="medium"
              color="blue"
              href={download}
              target="_blank"
              icon="download"
            />
          }
        />
        <Popup
          open={open}
          onClose={() => setOpen(false)}
          content={t('messages.link-copied-to-clipboard')}
          position="bottom right"
          trigger={(
            <CopyToClipboard text={link} onCopy={() => setOpen(true)}>
              <Button
                basic
                icon="copy outline"
                compact
                size="medium"
                color="blue"
              />
            </CopyToClipboard>
          )}
        />
      </GridColumn>
    </GridRow>
  );
};

export default withTranslation()(DownloadTrimItem);
