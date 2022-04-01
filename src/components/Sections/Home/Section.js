import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import * as shapes from '../../shapes';

const Section = ({ title, children, className, computer= 12, tablet= 14, mobile= 16 }) =>
  <div className={className}>
    <Grid centered padded="vertically" className="homepage__section__iconsrow">
      <Grid.Row className="iconsTitleRow">
        <div className="iconsTitle">{title}</div>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column computer={computer} tablet={tablet} mobile={mobile}>
          {children}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </div>

Section.propTypes = {
  title: PropTypes.string.isRequired,
  children: shapes.Children.isRequired,
};

export default Section;
