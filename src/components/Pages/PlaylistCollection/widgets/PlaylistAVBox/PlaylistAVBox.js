import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';

import { MT_AUDIO, MT_VIDEO } from '../../../../../helpers/consts';
import withIsMobile from '../../../../../helpers/withIsMobile';
import playerHelper from '../../../../../helpers/player';
import * as shapes from '../../../../shapes';
import AVPlaylistPlayer from '../../../../AVPlayer/AVPlaylistPlayer';

class PlaylistAVBox extends Component {

  static propTypes = {
    history: shapes.History.isRequired,
    location: shapes.HistoryLocation.isRequired,
    collection: shapes.GenericCollection.isRequired,
    PlayListComponent: PropTypes.any.isRequired,
    language: PropTypes.string.isRequired,
    onSelectedChange: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    isMobile: PropTypes.bool.isRequired,
  };

  state = {
    selected: 0,
  };

  componentDidMount() {
    const { isMobile, collection, language, history, location, onSelectedChange } = this.props;

    const mediaType      = playerHelper.getMediaTypeFromQuery(history.location, isMobile ? MT_AUDIO : MT_VIDEO);
    const playerLanguage = playerHelper.getLanguageFromQuery(location, language);
    const playlist       = playerHelper.playlist(collection, mediaType, language);
    let selected         = playerHelper.getActivePartFromQuery(location);

    if (Array.isArray(playlist.items) && playlist.items.length > 0) {
      if (selected >= playlist.items.length) {
        selected = 0;
        playerHelper.setActivePartInQuery(history, selected);
      }
      onSelectedChange(playlist.items[selected].unit);
    }

    this.setState({ playlist, selected });

    playerHelper.setLanguageInQuery(history, playerLanguage);
  }

  componentWillReceiveProps(nextProps) {
    const { isMobile, collection, language, location } = nextProps;
    const {
            collection: oldCollection,
            language: oldLanguage,
            location: oldLocation
          }                                            = this.props;

    const prevMediaType = playerHelper.getMediaTypeFromQuery(oldLocation, isMobile ? MT_AUDIO : MT_VIDEO);
    const newMediaType  = playerHelper.getMediaTypeFromQuery(location, isMobile ? MT_AUDIO : MT_VIDEO);

    if (oldCollection !== collection ||
      oldLanguage !== language ||
      prevMediaType !== newMediaType) {
      // Persist language in playableItem
      this.setPlaylist(collection, newMediaType, this.state.playlist.language);
    }
  }

  setPlaylist = (collection, mediaType, language) => {
    const playlist = playerHelper.playlist(collection, mediaType, language);
    this.setState({ playlist });
  };

  handleSelectedChange = (selected) => {
    this.setState({ selected });
    playerHelper.setActivePartInQuery(this.props.history, selected);
    this.props.onSelectedChange(this.state.playlist.items[selected].unit);
  };

  handleLanguageChange = (e, language) => {
    const { collection, history } = this.props;
    const { playlist, selected }  = this.state;

    const playableItem = playlist.items[selected];
    if (language !== playableItem.language) {
      this.setPlaylist(collection, playableItem.mediaType, language);
    }

    playerHelper.setLanguageInQuery(history, language);
  };

  handleSwitchAV = () => {
    const { history }            = this.props;
    const { playlist, selected } = this.state;

    const s = playlist.items[selected];
    if (s.mediaType === MT_AUDIO && s.availableMediaTypes.includes(MT_VIDEO)) {
      playerHelper.setMediaTypeInQuery(history, MT_VIDEO);
    } else if (s.mediaType === MT_VIDEO && s.availableMediaTypes.includes(MT_AUDIO)) {
      playerHelper.setMediaTypeInQuery(history, MT_AUDIO);
    }
  };

  render() {
    const { t, PlayListComponent } = this.props;
    const { playlist, selected }   = this.state;

    if (!playlist ||
      !Array.isArray(playlist.items) ||
      playlist.items.length === 0) {
      return null;
    }

    return (
      <Grid.Row>
        <Grid.Column computer={10} mobile={16}>
          <AVPlaylistPlayer
            items={playlist.items}
            selected={selected}
            language={playlist.language}
            onSelectedChange={this.handleSelectedChange}
            onLanguageChange={this.handleLanguageChange}
            onSwitchAV={this.handleSwitchAV}
            t={t}
          />
        </Grid.Column>
        <Grid.Column className="avbox__playlist" computer={6} mobile={16}>
          <PlayListComponent
            playlist={playlist}
            selected={selected}
            onSelectedChange={this.handleSelectedChange}
            t={t}
          />
        </Grid.Column>
      </Grid.Row>
    );
  }
}

export default withIsMobile(withRouter(PlaylistAVBox));
