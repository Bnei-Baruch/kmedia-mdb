import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment-duration-format';
import { Trans, translate } from 'react-i18next';
import { Container, Embed, Grid, Header, Image, Menu, Table } from 'semantic-ui-react';

import { fromToLocalized } from '../../../helpers/date';
import { formatError } from '../../../helpers/utils';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../shared/Splash';
import Link from '../../Language/MultiLanguageLink';
import NavLink from '../../Language/MultiLanguageNavLink';
import * as shapes from '../../shapes';

import placeholder from './placeholder.png';
import EventMap from './EventMap'

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

  titleDate = (fromStr, toStr) =>{
    return fromToLocalized(moment.utc(fromStr, "YYYY-MM-DD"), moment.utc(toStr, "YYYY-MM-DD"));
  }

  render() {
    const { language, fullEvent, wip, err, t } = this.props;

    if (err) {
      return <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
    }

    if (fullEvent) {
      const description = !fullEvent.description ? null : (
        <p>{fullEvent.description}</p>
      );

      return (
        <Container>
          <Grid>
            <Grid.Row>
              <Grid.Column width={3}>
                 <Image fluid shape='rounded' src={placeholder} />
              </Grid.Column>
              <Grid.Column width={8}>
                <Header as='h1'>
                  <Header.Content>
                    <small className='text grey'>{this.titleDate(fullEvent.start_date, fullEvent.end_date)}</small>
                    <br/>
                    {fullEvent.name}
                    <Header.Subheader>
                      {fullEvent.city}, {fullEvent.country}
                    </Header.Subheader>
                  </Header.Content>
                </Header>
                {description}
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <EventMap language={language}
                          address={fullEvent.full_address}
                          city={fullEvent.city}
                          country={fullEvent.country} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
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
        </Container>
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

