import React, { useContext, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button, Container, Divider, Grid, Modal } from 'semantic-ui-react';

import { DeviceInfoContext } from '../../helpers/app-contexts';
import { getLanguageDirection } from '../../helpers/i18n-utils';
import { selectors as settings } from '../../redux/modules/settings';

const SectionFiltersWithMobile = ({ filters, children, t }) => {
  const [openFilters, setOpenFilters] = useState(false);

  const { isMobileDevice } = useContext(DeviceInfoContext);

  const language = useSelector(state => settings.getLanguage(state.settings));
  const dir      = getLanguageDirection(language);

  const toggleFilters = () => setOpenFilters(!openFilters);

  const render = () => (
    <Container className="padded" fluid>
      <Divider />
      <Grid container>
        <Grid.Column width="4" className="filters-aside-wrapper">
          {filters}
        </Grid.Column>
        <Grid.Column width={12}>
          {children}
        </Grid.Column>
      </Grid>
    </Container>
  );

  const renderMobile = () => (
    <Container fluid>
      <Button basic icon="filter" floated={'right'} onClick={toggleFilters} />
      <Divider className="clear" />

      {children}

      <Modal
        closeIcon
        open={openFilters}
        onClose={toggleFilters}
        dir={dir}
        className={dir}
      >
        <Modal.Content className="filters-aside-wrapper" scrolling>
          {filters}
        </Modal.Content>
        <Modal.Actions>
          <Button primary content={t('buttons.close')} onClick={toggleFilters} />
        </Modal.Actions>
      </Modal>
    </Container>
  );

  return isMobileDevice ? renderMobile() : render();
};

export default withNamespaces()(SectionFiltersWithMobile);
