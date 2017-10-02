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
  const { program, fullProgram, wip, err, t } = props;

  if (err) {
    return <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
  }

  if (wip) {
    return <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
  }

  if (fullProgram && Array.isArray(fullProgram.content_units)) {
    const otherParts = fullProgram.content_units.filter(part => part.id !== program.id);

    return (
      otherParts.length ? (
        <div style={{ marginTop: '50px' }}>
          <Header as="h3" content={t('programs.part.relevant-parts.title')} />
          <Item.Group divided link>
            {
              otherParts.slice(0, 3).map(part => (
                <Item as={Link} key={part.id} to={`/programs/chapter/${part.id}`}>
                  <Item.Image src={myimage} size="tiny" />
                  <Item.Content>
                    <Header
                      as="h4"
                      content={t('programs.part.relevant-parts.item-title', { name: fullProgram.ccuNames[part.id] })}
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
                  to={`/programs/full/${fullProgram.id}`}
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
      text={t('messages.program-not-found')}
      subtext={
        <Trans i18nKey="messages.program-not-found-subtext">
          Try the <Link to="/programs">programs list</Link>...
        </Trans>
      }
    />
  );
};

RelevantParts.propTypes = {
  program: shapes.ProgramChapter.isRequired,
  fullProgram: shapes.ProgramCollection,
  wip: shapes.WIP,
  err: shapes.Error,
  t: PropTypes.func.isRequired,
};

RelevantParts.defaultProps = {
  fullProgram: null,
  wip: false,
  err: null,
};

export default RelevantParts;
