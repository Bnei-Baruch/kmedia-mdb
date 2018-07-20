import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';

import { MT_AUDIO, MT_VIDEO } from '../../../../../helpers/consts';
import playerHelper from '../../../../../helpers/player';
import * as shapes from '../../../../shapes';
import AVPlaylistPlayer from '../../../../AVPlayer/AVPlaylistPlayer';

class PlaylistAVBox extends Component {
  static propTypes = {
    history: shapes.History.isRequired,
    location: shapes.HistoryLocation.isRequired,
    collection: shapes.GenericCollection.isRequired,
    PlayListComponent: PropTypes.any.isRequired,
    uiLanguage: PropTypes.string.isRequired,
    contentLanguage: PropTypes.string.isRequired,
    onSelectedChange: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    nextLink: PropTypes.string,
    prevLink: PropTypes.string,
  };

  static defaultProps = {
    nextLink: null,
    prevLink: null,
  };

  state = {
    selected: 0,
  };

  componentWillMount() {
    const { collection, uiLanguage, contentLanguage, history, location, onSelectedChange } = this.props;

    const preferredMT    = playerHelper.restorePreferredMediaType();
    const mediaType      = playerHelper.getMediaTypeFromQuery(history.location, preferredMT);
    const playerLanguage = playerHelper.getLanguageFromQuery(location, contentLanguage);
    const playlist       = playerHelper.playlist(collection, mediaType, playerLanguage, uiLanguage);
    let selected         = playerHelper.getActivePartFromQuery(location);

    if (Array.isArray(playlist.items) && playlist.items.length > 0) {
      if (selected >= playlist.items.length) {
        selected = 0;
        playerHelper.setActivePartInQuery(history, selected);
      }
      onSelectedChange(playlist.items[selected].unit);
    }
    this.setState({ playlist, selected });

    playerHelper.setLanguageInQuery(history, playlist.language);
  }

  componentWillReceiveProps(nextProps) {
    const { collection, uiLanguage, contentLanguage, location } = nextProps;

    const
      {
        collection: oldCollection,
        uiLanguage: oldUiLanguage,
        contentLanguage: oldContentLanguage,
        location: oldLocation
      }                                = this.props;
    const { selected, playlist }       = this.state;
    const { language: playerLanguage } = playlist;

    const preferredMT     = playerHelper.restorePreferredMediaType();
    const prevMediaType   = playerHelper.getMediaTypeFromQuery(oldLocation);
    const newMediaType    = playerHelper.getMediaTypeFromQuery(location, preferredMT);
    const newItemLanguage = playerHelper.getLanguageFromQuery(location, playerLanguage);

    // no change
    if (oldCollection === collection &&
      oldUiLanguage === uiLanguage &&
      oldContentLanguage === contentLanguage &&
      prevMediaType === newMediaType &&
      newItemLanguage === playerLanguage) {
      return;
    }

    // Recalculate playlist
    const nPlaylist = playerHelper.playlist(collection, newMediaType, playerLanguage, newItemLanguage);
    this.setState({ playlist: nPlaylist });

    // When moving from playlist to another playlist
    // we're already mounted. We have to make sure to change selected as well.
    // There are 2 cases:
    //   1. Active part changed in query
    //   2. Active part hasn't change in query but playlist has changed
    //      and it's no longer the same unit

    const nSelected = playerHelper.getActivePartFromQuery(location);
    if (nSelected !== selected) {
      // case # 1
      this.setState({ selected: nSelected });
      playerHelper.setActivePartInQuery(nextProps.history, nSelected);
      nextProps.onSelectedChange(nPlaylist.items[nSelected].unit);
    } else if (
      playlist &&
      nPlaylist &&
      playlist.items[selected] &&
      nPlaylist.items[selected] &&
      playlist.items[selected].unit &&
      nPlaylist.items[selected].unit &&
      playlist.items[selected].unit !== nPlaylist.items[selected].unit
    ) {
      // case # 2
      this.setState({ selected: nSelected });
      nextProps.onSelectedChange(nPlaylist.items[nSelected].unit);
    }
  }

  handleSelectedChange = (selected) => {
    this.setState({ selected });
    playerHelper.setActivePartInQuery(this.props.history, selected);
    this.props.onSelectedChange(this.state.playlist.items[selected].unit);
  };

  handleLanguageChange = (e, language) => {
    playerHelper.setLanguageInQuery(this.props.history, language);
  };

  handleSwitchAV = () => {
    const { history }            = this.props;
    const { playlist, selected } = this.state;

    const s = playlist.items[selected];
    if (s.mediaType === MT_AUDIO && s.availableMediaTypes.includes(MT_VIDEO)) {
      playerHelper.setMediaTypeInQuery(history, MT_VIDEO);
      playerHelper.persistPreferredMediaType(MT_VIDEO);
    } else if (s.mediaType === MT_VIDEO && s.availableMediaTypes.includes(MT_AUDIO)) {
      playerHelper.setMediaTypeInQuery(history, MT_AUDIO);
      playerHelper.persistPreferredMediaType(MT_AUDIO);
    }
  };

  render() {
    const { t, PlayListComponent, uiLanguage, nextLink, prevLink } = this.props;
    const { playlist, selected }                       = this.state;

    if (!playlist ||
      !Array.isArray(playlist.items) ||
      playlist.items.length === 0) {
      return null;
    }

    return (
      <Grid.Row>
        <Grid.Column mobile={16} tablet={10} computer={10}>
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
        <Grid.Column className="avbox__playlist" mobile={16} tablet={6} computer={6}>
          <PlayListComponent
            playlist={playlist}
            selected={selected}
            language={uiLanguage}
            onSelectedChange={this.handleSelectedChange}
            t={t}
            nextLink={nextLink}
            prevLink={prevLink}
          />
        </Grid.Column>
      </Grid.Row>
    );
  }
}

export default withRouter(PlaylistAVBox);
