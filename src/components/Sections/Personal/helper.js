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
import { actions, selectors as myselector } from '../../../redux/modules/my';
import { MY_NAMESPACE_HISTORY, MY_NAMESPACE_LIKES } from '../../../helpers/consts';

export const HistoryItem = ({ data: { item: history, mdbItem: unit }, t }) => {
  const dispatch         = useDispatch();
  const link             = canonicalLink(unit);
  const canonicalSection = imageByUnit(unit, link);

  const remove = () => dispatch(actions.remove(MY_NAMESPACE_HISTORY, { ids: [history.id] }));

  return (
    <Card raised>
      <UnitLogo width={512} unitId={unit.id} fallbackImg={canonicalSection} />
      <Card.Content>
        <Button floated={'right'} size={'tiny'} icon={'remove'} onClick={remove} />
        <Header size="tiny">{unit.name}</Header>
      </Card.Content>
      <Card.Content extra>
        <Card.Meta content={`${t('values.date', { date: unit.film_date })} - ${unit.name}`} />
      </Card.Content>
    </Card>
  );
};

export const LikeItem = ({ data: { item: like, mdbItem: unit }, t }) => {
  const dispatch         = useDispatch();
  const link             = canonicalLink(unit);
  const canonicalSection = imageByUnit(unit, link);

  const likeDislike = () => {
    if (like)
      dispatch(actions.remove(MY_NAMESPACE_LIKES, { ids: [like.id] }));
    else
      dispatch(actions.add(MY_NAMESPACE_LIKES, { uids: [unit.id] }));
  };

  return (
    <Card raised>
      <UnitLogo width={512} unitId={unit.id} fallbackImg={canonicalSection} />
      <Card.Content>
        <Button floated="right" size="tiny" icon="remove" onClick={likeDislike} />
        <Header size="tiny">{unit.name}</Header>
      </Card.Content>
      <Card.Content extra>
        <Card.Meta content={`${t('values.date', { date: unit.film_date })} - ${unit.name}`} />
      </Card.Content>
    </Card>
  );
};

const Template = ({ items, namespace, t }) => {
  const itemsPerRow = 4;

  const renderUnit = (x) => {
    switch (namespace) {
    case MY_NAMESPACE_LIKES:
      return <LikeItem data={x} t={t} />;
    case MY_NAMESPACE_HISTORY:
      return <HistoryItem data={x} t={t} />;
    }
    return null;
  };

  return (
    <div className="homepage__thumbnails">
      <Container fluid className="padded">
        <Grid columns='equal'>
          <Grid.Row>
            <Grid.Column><h1>{t(`my.${namespace}`)}</h1></Grid.Column>
            <Grid.Column>
              <Link to={`/personal/${namespace}`}>
                <Button floated='right' basic color='blue'>
                  {t('search.showAll')}
                </Button>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Card.Group itemsPerRow={itemsPerRow} doubling>
          {items.map(renderUnit)}
        </Card.Group>
      </Container>
    </div>
  );
};

Template.propTypes = {
  items: PropTypes.arrayOf(shapes.ContentUnit),
  t: PropTypes.func.isRequired
};

export default withNamespaces()(Template);
