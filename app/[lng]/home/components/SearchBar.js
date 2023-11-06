import React from 'react';
import { Grid, Header, GridRow, GridColumn } from '/lib/SUI';
import { useTranslation } from '../../../i18n';
import OmniBox from '../../../../src/components/Search/OmniBox';

const SearchBar = async ({ lng }) => {
  const { t } = await useTranslation(lng);
  return (
    <Grid centered>
      <GridRow>
        <GridColumn computer={12} tablet={14} mobile={16}>
          <Header as="h1" content={t('home.search')} className="homepage__title text white" />
        </GridColumn>
        <GridColumn computer={12} tablet={14} mobile={16}>
          <div className="homepage__search">
            <OmniBox isHomePage={true} />
          </div>
        </GridColumn>
      </GridRow>
    </Grid>
  );
};

export default SearchBar;
