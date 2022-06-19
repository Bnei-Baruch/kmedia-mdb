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

  return (<>
    <Container className="padded" fluid>
      {
        isMobileDevice && <Button className="" basic icon="filter" floated={'right'} onClick={toggleFilters} />
      }
      <Divider />
      <Grid divided>
        {
          !isMobileDevice ? (
            <Grid.Column width="4" className="filters-aside-wrapper">
              {filters}
            </Grid.Column>
          ) : (
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
          )

        }
        <Grid.Column width={isMobileDevice ? 16 : 12}>
          {children}
        </Grid.Column>
      </Grid>
    </Container>
  </>
  );
};

export default withNamespaces()(SectionFiltersWithMobile);
