import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment-duration-format';
import { Trans, translate } from 'react-i18next';
import { Container, Grid, Header, Image, Menu, Table } from 'semantic-ui-react';

import { formatError } from '../../../helpers/utils';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../shared/Splash';
import Link from '../../Language/MultiLanguageLink';
import NavLink from '../../Language/MultiLanguageNavLink';
import * as shapes from '../../shapes';

class FullProgram extends Component {
  static propTypes = {
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

  state = {
    activePart: 0,
  };

  getName = (fullEvent, cu) => (
    fullEvent.ccuNames[cu.id]
  );

  header = (fullProgram, t) => (
    <div className="section-header">
      <Container className="padded">
        <Grid>
          <Grid.Row>
            <Grid.Column width={3}>
              <Image fluid shape="rounded" src="http://www.kab.co.il/images/attachments/91/276191_medium.jpg" />
            </Grid.Column>
            <Grid.Column width={8}>
              <Header as="h1">
                <Header.Content>
                  {fullProgram.name}
                  <Header.Subheader>
                    {fullProgram.content_units.length}&nbsp;{t('programs.full.episodes')}
                  </Header.Subheader>
                </Header.Content>
              </Header>
              <p>{fullProgram.description}</p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );

  tableRow = (fullProgram, cu) => {
    // const { ccuName } = this.getName(fullProgram, cu);
    const duration  = moment.duration(cu.duration, 'seconds').format('hh:mm:ss');
    const filmDate = moment(cu.film_date).format('L');

    return (
      <Table.Row key={cu.id}>
        <Table.Cell><Menu.Item as={NavLink} to={`/programs/chapter/${cu.id}`}>{filmDate}</Menu.Item></Table.Cell>
        {/* <Table.Cell><Menu.Item as={NavLink} to={`/programs/chapter/${cu.id}`} content={ccuName} /></Table.Cell> */}
        <Table.Cell><Menu.Item as={NavLink} to={`/programs/chapter/${cu.id}`}>{cu.name}</Menu.Item></Table.Cell>
        <Table.Cell><Menu.Item as={NavLink} to={`/programs/chapter/${cu.id}`}>{duration}</Menu.Item></Table.Cell>
      </Table.Row>
    );
  };

  table = (fullProgram, t) => (
    <Menu vertical fluid>
      <Table basic="very" compact="very" celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>{t('programs.full.film_date')}</Table.HeaderCell>
            {/* <Table.HeaderCell>{t('programs.full.ccuName')}</Table.HeaderCell> */}
            <Table.HeaderCell>{t('programs.full.name')}</Table.HeaderCell>
            <Table.HeaderCell>{t('programs.full.duration')}</Table.HeaderCell>
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

  render() {
    const { fullProgram, wip, err, t } = this.props;

    if (err) {
      return <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
    }

    if (wip) {
      return <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
    }

    if (fullProgram && fullProgram.content_units) {
      return (
        <div>
          {this.header(fullProgram, t)}
          <Container className="padded">
            {this.table(fullProgram, t)}
          </Container>
        </div>
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
  }
}

export default translate()(FullProgram);

