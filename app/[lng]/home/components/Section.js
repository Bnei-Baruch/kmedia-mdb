import React from 'react';

import { Grid, GridRow, GridColumn, } from '/lib/SUI';

const Section = ({ title, children, className, computer = 12, tablet = 14, mobile = 16 }) =>
  <div className={className}>
    <Grid centered padded="vertically" className="homepage__section__iconsrow">
      <GridRow className="iconsTitleRow">
        <div className="iconsTitle">{title}</div>
      </GridRow>
      <GridRow>
        <GridColumn computer={computer} tablet={tablet} mobile={mobile}>
          {children}
        </GridColumn>
      </GridRow>
    </Grid>
  </div>;

export default Section;
