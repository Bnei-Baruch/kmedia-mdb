import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Card, Container, Button, Grid, Header } from 'semantic-ui-react';


import * as shapes from '../../shapes';
import { withNamespaces } from 'react-i18next';
import { canonicalLink } from '../../../helpers/links';
import { imageByUnit } from '../../../helpers/utils';
import Link from '../../Language/MultiLanguageLink';
import UnitLogo from '../../shared/Logo/UnitLogo';
import { toHumanReadableTime } from '../../../helpers/time';

export const renderHistoryItem = (unit, t) => {
  const link             = canonicalLink(unit);
  const canonicalSection = imageByUnit(unit, link);
  const sep              = link.indexOf('?') > 0 ? `&` : '?';

  return (
    <Card as={Link} to={`${link}${sep}sstart=${toHumanReadableTime(unit.current_time)}`} raised>
      <UnitLogo width={512} unitId={unit.id} fallbackImg={canonicalSection} />
      <Card.Content>
        <Header size="tiny">{unit.name}</Header>
      </Card.Content>
      <Card.Content extra>
        <Card.Meta content={`${t('values.date', { date: unit.film_date })} - ${unit.name}`} />
      </Card.Content>
    </Card>
  );
};

const Template = ({ items, title, t, rowsNumber = 2, renderUnit, linkToAll }) => {

  const itemsPerRow = 4;

  return (
    <div className="homepage__thumbnails">
      {/* <Divider horizontal fitted>{title}</Divider> */}
      <Container fluid className="padded">
        <Grid columns='equal'>
          <Grid.Row>
            <Grid.Column><h1>{title}</h1></Grid.Column>
            <Grid.Column>
              <Link to="/personal/history">
                <Button floated='right' basic color='blue'>
                  {t('search.showAll')}
                </Button>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Card.Group itemsPerRow={itemsPerRow} doubling>
          {items.map(x => renderUnit(x, t))}
        </Card.Group>
      </Container>
    </div>
  );
};

Template.propTypes = {
  items: PropTypes.arrayOf(shapes.ContentUnit),
  title: PropTypes.string,
  t: PropTypes.func.isRequired
};

export default withNamespaces()(Template);
