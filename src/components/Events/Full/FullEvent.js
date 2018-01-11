import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans, translate } from 'react-i18next';
import { Container, Grid } from 'semantic-ui-react';

import { formatError } from '../../../helpers/utils';
import * as shapes from '../../shapes';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../shared/Splash';
import FullVideoBox from '../../shared/UnitPlayer/FullVideoBox';
import Materials from '../../shared/UnitMaterials/Materials';
import MediaDownloads from '../../shared/MediaDownloads';
import Link from '../../Language/MultiLanguageLink';
import Info from '../../pages/Unit/widgets/Info/Info';
// import Info from '../Item/Info';
// import PageHeader from './PageHeader';
// import EventMap from './EventMap';
import Playlist from './Playlist';

class FullEvent extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    collection: shapes.EventCollection,
    wip: shapes.WIP,
    err: shapes.Error,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    collection: null,
    wip: false,
    err: null,
  };

  state = {
    activePart: 0,
  };

  handleActivePartChange = activePart =>
    this.setState({ activePart });

  render() {
    const { language, collection, wip, err, t } = this.props;

    if (err) {
      if (err.response && err.response.status === 404) {
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

      return <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
    }

    if (wip) {
      return <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
    }

    if (!collection || !Array.isArray(collection.content_units)) {
      return null;
    }

    const { activePart } = this.state;
    const unit           = collection.content_units[activePart];
    return (
      <div>
        {/*<PageHeader item={collection} />
          <EventMap
            language={language}
            address={collection.full_address}
            city={collection.city}
            country={collection.country}
          />*/}
        <div className="avbox">
          <Container>
            <Grid padded>
              <FullVideoBox
                collection={collection}
                activePart={activePart}
                language={language}
                t={t}
                onActivePartChange={this.handleActivePartChange}
                PlayListComponent={Playlist}
              />
            </Grid>
          </Container>
        </div>
        <Container>
          <Grid padded reversed="tablet">
            <Grid.Row reversed="computer">
              <Grid.Column computer={6} tablet={8} mobile={16} className="content__aside">
                <MediaDownloads unit={unit} language={language} t={t} />
              </Grid.Column>
              <Grid.Column computer={10} tablet={8} mobile={16} className="content__main">
                <Info unit={unit} t={t} />
                <Materials unit={unit} t={t} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default translate()(FullEvent);
