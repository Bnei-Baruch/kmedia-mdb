import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment-duration-format';
import { Trans, translate } from 'react-i18next';
import { Menu, Table } from 'semantic-ui-react';

import { formatError } from '../../../helpers/utils';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../shared/Splash';
import Link from '../../Language/MultiLanguageLink';
import NavLink from '../../Language/MultiLanguageNavLink';
import * as shapes from '../../shapes';

class FullEvent extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    fullEvent: shapes.EventCollection,
    wip: shapes.WIP,
    err: shapes.Error,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    fullEvent: null,
    wip: false,
    err: null,
  };

  getName = (fullEvent, cu) => {
    const { name, duration } = cu;
    const ccuName            = fullEvent.ccuNames[cu.id];
    const durationDisplay    = moment.duration(duration, 'seconds').format('hh:mm:ss');
    return { name, ccuName, duration: durationDisplay };
  };

  tableRow = (fullEvent, cu) => {
    const { ccuName, name, duration } = this.getName(fullEvent, cu);

    return (
      <Table.Row key={cu.id}>
        <Table.Cell><Menu.Item as={NavLink} to={`/events/item/${cu.id}`} content={ccuName} /></Table.Cell>
        <Table.Cell><Menu.Item as={NavLink} to={`/events/item/${cu.id}`}>{name}</Menu.Item></Table.Cell>
        <Table.Cell><Menu.Item as={NavLink} to={`/events/item/${cu.id}`}>{duration}</Menu.Item></Table.Cell>
      </Table.Row>
    );
  };

  render() {
    const { fullEvent, wip, err, t } = this.props;

    if (err) {
      return <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
    }

    if (fullEvent) {
      return (
        <Menu vertical fluid>
          <Table basic="very" compact="very" celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>ccuName</Table.HeaderCell>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Duration</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {
                fullEvent.content_units.map(cu => (
                  this.tableRow(fullEvent, cu)
                ))
              }
            </Table.Body>
          </Table>
        </Menu>
      );
    }

    if (wip) {
      return <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
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
  }
}

export default translate()(FullEvent);

