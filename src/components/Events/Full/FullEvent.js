import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'moment-duration-format';
import { Trans, translate } from 'react-i18next';
import { Container, Grid } from 'semantic-ui-react';

import { formatError } from '../../../helpers/utils';
import * as shapes from '../../shapes';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../shared/Splash';
import FullVideoBox from '../../shared/UnitPlayer/FullVideoBox';
import Materials from '../../shared/UnitMaterials/Materials';
import MediaDownloads from '../../shared/MediaDownloads';
import Link from '../../Language/MultiLanguageLink';
import Info from '../Item/Info';
import PageHeader from './PageHeader';
import EventMap from './EventMap';
import FullEventPlaylist from './FullEventPlaylist';

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

  state = {
    activePart: 0,
  };

  handleActivePartChange = activePart =>
    this.setState({ activePart });

  render() {
    const { language, fullEvent, wip, err, t } = this.props;
    const { activePart }                       = this.state;

    if (err) {
      return <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
    }

    if (wip) {
      return <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
    }

    if (fullEvent) {
      const activeUnit = fullEvent.content_units[activePart];
      return (
        <div>
          <PageHeader item={fullEvent} />
          <EventMap
            language={language}
            address={fullEvent.full_address}
            city={fullEvent.city}
            country={fullEvent.country}
          />
            <Grid padded>
              <FullVideoBox
                collection={fullEvent}
                activePart={activePart}
                language={language}
                t={t}
                onActivePartChange={this.handleActivePartChange}
                PlayListComponent={FullEventPlaylist}
              />
            </Grid>
            <Grid padded reversed="tablet">
              <Grid.Row reversed="computer">
                <Grid.Column computer={6} tablet={4} mobile={16}>
                  <MediaDownloads unit={activeUnit} language={language} t={t} />
                </Grid.Column>
                <Grid.Column computer={10} tablet={12} mobile={16}>
                  <Info unit={activeUnit} t={t} />
                  <Materials unit={activeUnit} t={t} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
         
        </div>
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

  }
}

export default translate()(FullEvent);

