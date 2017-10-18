import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment-duration-format';
import { Trans } from 'react-i18next';
import { Container, Header, Item } from 'semantic-ui-react';

import { formatError } from '../../../../helpers/utils';
import * as shapes from '../../../shapes';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../../shared/Splash';
import Link from '../../../Language/MultiLanguageLink';
import myimage from './image.png';

const RelevantParts = (props) => {
  const { unit, collection, wip, err, t } = props;

  if (err) {
    return <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
  }

  if (wip) {
    return <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
  }

  if (collection && Array.isArray(collection.content_units)) {
    const otherParts = collection.content_units.filter(x => x.id !== unit.id);

    return (
      otherParts.length ? (
        <div style={{ marginTop: '50px' }}>
          <Header as="h3" content={t('events.part.relevant-parts.title')} />
          <Item.Group divided link>
            {
              otherParts.slice(0, 3).map(part => (
                <Item as={Link} key={part.id} to={`/events/item/${part.id}`}>
                  <Item.Image src={myimage} size="tiny" />
                  <Item.Content>
                    <Item.Description>{part.name}</Item.Description>
                    <Item.Meta>
                      <small>{moment.duration(part.duration, 'seconds').format('hh:mm:ss')}</small>
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
      ) : <div />
    );
  }

  return (
    <FrownSplash
      text={t('messages.event-not-found')}
      subtext={
        <Trans i18nKey="messages.event-not-found-subtext">
          Try the <Link to="/events">events list</Link>...
        </Trans>
      }
    />
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
