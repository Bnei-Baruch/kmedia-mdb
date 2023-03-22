import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Grid, Header } from 'semantic-ui-react';
import OmniBox from '../../Search/OmniBox';

const SearchBar = ({ t }) => (
  <Grid centered>
    <Grid.Row>
      <Grid.Column computer={12} tablet={14} mobile={16}>
        <Header as="h1" content={t('home.search')} className="homepage__title text white" />
      </Grid.Column>
      <Grid.Column computer={12} tablet={14} mobile={16}>
        <div className="homepage__search">
          <OmniBox isHomePage={true} />
        </div>
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

SearchBar.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation()(SearchBar);
