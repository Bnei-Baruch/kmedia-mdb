import React, { useEffect, useState } from 'react';
import { Button, Container, Divider, Grid, GridColumn, GridRow, Header, Segment } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { selectors } from '../../../redux/modules/trim';
import { Splash } from '../../shared/Splash/Splash';
import DownloadTrimItem from './DownloadTrimItem';
import clsx from 'clsx';

const DownloadTrim = ({ t }) => {
  const [open, setOpen]   = useState(true);
  const [isMin, setIsMin] = useState(false);

  const list = useSelector(state => selectors.getList(state.trim));
  const wips = useSelector(state => selectors.getWIPs(state.trim));

  useEffect(() => {
    setOpen(true);
    setIsMin(false);
  }, [list.length]);
  if ((list.length === 0 && wips.length === 0) || !open)
    return null;

  const renderWip = (x, i) => {
    i = list.length + i + 1;
    return (
      <GridRow key={`wip_${i}`}>
        <GridColumn width={9} verticalAlign={'middle'}>
          {`${i}. ${t('messages.trimmed-content-wip')} `}
          <Splash isLoading icon="circle notch" color="blue" width="20" />
        </GridColumn>
        <GridColumn>
        </GridColumn>
      </GridRow>
    );
  };

  return (
    <div className={clsx('trimmed_files', { 'minimized': isMin })}>
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
                  list.map((item, i) => <DownloadTrimItem key={i} pos={i + 1} item={item} />)
                }
                {
                  wips.map(renderWip)
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
