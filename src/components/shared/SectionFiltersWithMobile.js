import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button, Container, Grid, Modal } from 'semantic-ui-react';

import { DeviceInfoContext } from '../../helpers/app-contexts';
import { selectors as settings } from '../../redux/modules/settings';
import FiltersHydrator from '../Filters/FiltersHydrator';

const SectionFiltersWithMobile = ({ filters, children, namespace }) => {
  const [openFilters, setOpenFilters] = useState(false);
  const { t }                         = useTranslation();

  const { isMobileDevice } = useContext(DeviceInfoContext);

  const dir = useSelector(state => settings.getUIDir(state.settings));

  const toggleFilters = () => setOpenFilters(!openFilters);

  const render = () => (
    <Container className="padded" fluid>
      <Grid divided>
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
      {/*additional hydrate for mobile cause of modal */}
      <FiltersHydrator namespace={namespace} />
      <Container className="padded" fluid>
        <Button
          basic
          icon="filter"
          color="blue"
          onClick={toggleFilters}
          content={t('filters.aside-filter.filters-title')}
        />
      </Container>
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

export default SectionFiltersWithMobile;
