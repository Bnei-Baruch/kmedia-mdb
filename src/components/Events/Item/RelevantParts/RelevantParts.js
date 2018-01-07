import React from 'react';
import PropTypes from 'prop-types';
import { Container, Header, Item } from 'semantic-ui-react';

import { formatDuration, formatError, neighborIndices } from '../../../../helpers/utils';
import * as shapes from '../../../shapes';
import { ErrorSplash, LoadingSplash } from '../../../shared/Splash';
import Link from '../../../Language/MultiLanguageLink';
import UnitLogo from '../../../shared/Logo/UnitLogo';

const RelevantParts = (props) => {
  const { unit, collection, wip, err, t } = props;

  if (err) {
    return <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
  }

  if (wip) {
    return <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
  }

  if (!collection || !Array.isArray(collection.content_units)) {
    return null;
  }

  const idx        = collection.content_units.findIndex(x => x.id === unit.id);
  const neighbors  = neighborIndices(idx, collection.content_units.length, 3);
  const otherParts = neighbors.map(x => collection.content_units[x]);

  if (otherParts.length === 0) {
    return null;
  }

  return (
    <div className="content__aside-unit">
      <Header as="h3" content={t('events.part.relevant-parts.title')} />
      <Item.Group divided link>
        {
          otherParts.map(part => (
            <Item as={Link} key={part.id} to={`/events/item/${part.id}`}>
              <Item.Image size="small">
                <UnitLogo unitId={part.id} collectionId={collection.id} width={150} />
              </Item.Image>
              <Item.Content verticalAlign="top">
                <Header as="h5">
                  <small className="text grey uppercase">
                    {t('values.date', { date: new Date(part.film_date) })}
                  </small>
                  <br />
                  {part.name}
                </Header>
                <Item.Meta>
                  <small>{formatDuration(part.duration)}</small>
                </Item.Meta>
              </Item.Content>
            </Item>
          ))
        }
        <Item>
          <Item.Content>
            <Container
              fluid
              as={Link}
              textAlign="right"
              to={`/events/full/${collection.id}`}
            >
              {t('buttons.more')} &raquo;
            </Container>
          </Item.Content>
        </Item>
      </Item.Group>
    </div>
  );

};

RelevantParts.propTypes = {
  unit: shapes.ContentUnit.isRequired,
  collection: shapes.GenericCollection,
  wip: shapes.WIP,
  err: shapes.Error,
  t: PropTypes.func.isRequired,
};

RelevantParts.defaultProps = {
  collection: null,
  wip: false,
  err: null,
};

export default RelevantParts;
