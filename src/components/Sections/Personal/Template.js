import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Card, Container, Button, Grid } from 'semantic-ui-react';
import * as shapes from '../../shapes';
import LatestUpdate from './../Home/LatestUpdate';
import { withNamespaces } from 'react-i18next';

const displayUnit = (unit, label, t) =>
  <LatestUpdate key={unit.id} unit={unit} label={label} t={t} />;

const Template = ({ units, title, t }) => {
  const [seeAll, setSeeAll] = useState(false);
  const onClick = useCallback(() => setSeeAll(!seeAll), [seeAll]);

  const itemsPerRow = 4;
  const displayUnits = seeAll ? units : units.slice(0, itemsPerRow * 2);

  console.log('units:', units)

  return (
    <div className="homepage__thumbnails">
      {/* <Divider horizontal fitted>{title}</Divider> */}
      <Container fluid className="padded">
        <Grid columns='equal'>
          <Grid.Row>
            <Grid.Column ><h1>{title}</h1></Grid.Column>
            <Grid.Column >
              <Button floated='right' basic color='blue' onClick={onClick}>{t('search.showAll')}</Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Card.Group itemsPerRow={itemsPerRow} doubling>
          {displayUnits.map(u => displayUnit(u, u.name || "no name", t))}
        </Card.Group>
      </Container>
    </div>
  )
}

Template.propTypes = {
  units: PropTypes.arrayOf(shapes.ContentUnit),
  title: PropTypes.string,
  t: PropTypes.func.isRequired
};

export default withNamespaces()(Template);
