import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment-duration-format';
import { Container, Header, Item } from 'semantic-ui-react';

import { formatError, neighborIndices } from '../../../../helpers/utils';
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
    <div style={{ marginTop: '50px' }}>
      <Header as="h3" content={t('lessons.part.relevant-parts.title')} />
      <Item.Group divided link>
        {
          otherParts.map(part => (
            <Item as={Link} key={part.id} to={`/lessons/part/${part.id}`}>
              <Item.Image size="tiny">
                <UnitLogo unitId={part.id} collectionId={collection.id} />
              </Item.Image>
              <Item.Content>
                <Header
                  as="h4"
                  content={t('lessons.part.relevant-parts.item-title', { name: collection.ccuNames[part.id] })}
                />
                <Item.Meta>
                  <small>{moment.duration(part.duration, 'seconds').format('hh:mm:ss')}</small>
                </Item.Meta>
                <Item.Description>{part.name}</Item.Description>
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
              to={`/lessons/full/${collection.id}`}
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
