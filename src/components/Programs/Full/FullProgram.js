import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment-duration-format';
import { Trans, translate } from 'react-i18next';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Table } from 'semantic-ui-react';

import { formatError } from '../../../helpers/utils';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../shared/Splash';
import * as shapes from '../../shapes';

class FullProgram extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    fullProgram: shapes.ProgramCollection,
    wip: shapes.WIP,
    err: shapes.Error,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    fullProgram: null,
    wip: false,
    err: null,
  };

  getName = (fullProgram, cu) => {
    const { name, duration } = cu;
    const ccuName            = fullProgram.ccuNames[cu.id];
    const durationDisplay    = moment.duration(duration, 'seconds').format('hh:mm:ss');
    return { name, ccuName, duration: durationDisplay };
  };

  tableRow = (fullProgram, cu) => {
    const { ccuName, name, duration } = this.getName(fullProgram, cu);

    return (
      <Table.Row key={cu.id}>
        <Table.Cell><Menu.Item as={NavLink} to={`/programs/chapter/${cu.id}`} content={ccuName} /></Table.Cell>
        <Table.Cell><Menu.Item as={NavLink} to={`/programs/chapter/${cu.id}`}>{name}</Menu.Item></Table.Cell>
        <Table.Cell><Menu.Item as={NavLink} to={`/programs/chapter/${cu.id}`}>{duration}</Menu.Item></Table.Cell>
      </Table.Row>
    );
  };

  render() {
    const { fullProgram, wip, err, t } = this.props;

    if (err) {
      return <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
    }

    if (fullProgram) {
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
                fullProgram.content_units.map(cu => (
                  this.tableRow(fullProgram, cu)
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
        text={t('messages.program-not-found')}
        subtext={
          <Trans i18nKey="messages.program-not-found-subtext">
            Try the <Link to="/programs">programs list</Link>...
          </Trans>
        }
      />
    );
  }
}

export default translate()(FullProgram);

