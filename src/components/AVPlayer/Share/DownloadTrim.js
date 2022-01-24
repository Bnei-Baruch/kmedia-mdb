import React, { useEffect, useState } from 'react';
import { Button, Container, Divider, Grid, GridColumn, GridRow, Header, Popup, Segment } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { selectors } from '../../../redux/modules/trim';
import { Splash } from '../../shared/Splash/Splash';
import CopyToClipboard from 'react-copy-to-clipboard';

const DownloadTrim = ({ t }) => {
  const [open, setOpen]                       = useState(true);
  const [isMin, setIsMin]                     = useState(false);
  const [isCopyPopupOpen, setIsCopyPopupOpen] = useState(false);

  const list = useSelector(state => selectors.getList(state.trim));
  const wips = useSelector(state => selectors.getWIPs(state.trim));

  useEffect(() => {
    setOpen(true);
    setIsMin(false);
  }, [list.length]);
  if ((list.length === 0 && wips.length === 0) || !open)
    return null;

  const renderItem = ({ link, download, name }, i) => (
    <GridRow  key={`file_${i}`}>
      <GridColumn width="13">
        {`${wips.length + i + 1}. ${name}`}
      </GridColumn>
      <GridColumn width="3" textAlign="right">
        <Popup
          content={t('player.download.downloadButton')}
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
          open={isCopyPopupOpen}
          onClose={() => setIsCopyPopupOpen(false)}
          content={t('messages.link-copied-to-clipboard')}
          position="bottom right"
          trigger={(
            <CopyToClipboard text={link} onCopy={() => setIsCopyPopupOpen(true)}>
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

  const renderWip = (x, i) => (
    <GridRow key={`wip_${i}`}>
      <GridColumn width={9} verticalAlign={'middle'}>
        {`${i + 1}. ${t('messages.trimmed-content-wip')} `}
        <Splash isLoading icon="circle notch" color="blue" width="20" />
      </GridColumn>
      <GridColumn>
      </GridColumn>
    </GridRow>
  );

  return (
    <div className="trimmed_files">
      <Segment clearing className="top">
        <Button
          basic
          icon="close"
          floated="right"
          compact
          inverted
          size="medium"
          color="grey"
          onClick={() => setOpen(false)}
        />
        <Button
          basic
          icon={`chevron ${isMin ? 'up' : 'down'}`}
          floated="right"
          compact
          inverted
          size="medium"
          color="grey"
          onClick={() => setIsMin(!isMin)}
        />
        <Header
          as="h3"
          floated="left"
          inverted
          content={wips.length > 0 ? t('messages.trimmed-title-wip') : t('messages.trimmed-title')}
        />
      </Segment>
      {
        !isMin && (
          <>
            <Container className="padded content">
              <Grid>
                {
                  wips.map(renderWip)
                }
                {
                  list.map(renderItem)
                }
              </Grid>
            </Container>
            <Container className="padded" content={t('messages.trim-expiration')} />
            <Divider hidden />
          </>
        )
      }
    </div>
  );
};

export default withNamespaces()(DownloadTrim);
