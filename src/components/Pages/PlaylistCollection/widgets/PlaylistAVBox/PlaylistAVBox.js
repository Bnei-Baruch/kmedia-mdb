import React, { Component } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withNamespaces } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import isEqual from 'react-fast-compare';

import { MT_AUDIO, MT_VIDEO } from '../../../../../helpers/consts';
import playerHelper from '../../../../../helpers/player';
import * as shapes from '../../../../shapes';
import AVPlaylistPlayer from '../../../../AVPlayer/AVPlaylistPlayer';

class PlaylistAVBox extends Component {
  static propTypes = {
    history: shapes.History.isRequired,
    location: shapes.HistoryLocation.isRequired,
    collection: shapes.GenericCollection.isRequired,
    // There is no consensus on what the right prototype would be
    // https://github.com/facebook/react/issues/5143
    PlayListComponent: PropTypes.func.isRequired,
    uiLanguage: PropTypes.string.isRequired,
    contentLanguage: PropTypes.string.isRequired,
    onSelectedChange: PropTypes.func.isRequired,
    nextLink: PropTypes.string,
    prevLink: PropTypes.string,
  };

  static defaultProps = {
    nextLink: null,
    prevLink: null,
  };

  constructor(props) {
    super(props);
    const { collection, uiLanguage, contentLanguage, history, location, onSelectedChange } = props;

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

    this.state = {
      playlist,
      selected,
      embed: playerHelper.getEmbedFromQuery(location)
    };

    playerHelper.setLanguageInQuery(history, playlist.language);
  }

  static getDerivedStateFromProps(nextProps, state) {
    const { collection, location } = nextProps;

    const { selected, playlist }       = state;
    const { language: playerLanguage } = playlist;

    const preferredMT     = playerHelper.restorePreferredMediaType();
    const newMediaType    = playerHelper.getMediaTypeFromQuery(location, preferredMT);
    const newItemLanguage = playerHelper.getLanguageFromQuery(location, playerLanguage);

    // Recalculate playlist
    const nPlaylist = playerHelper.playlist(collection, newMediaType, newItemLanguage, playerLanguage);

    // When moving from playlist to another playlist
    // we're already mounted. We have to make sure to change selected as well.
    // There are 2 cases:
    //   1. Active part changed in query
    //   2. Active part hasn't change in query but playlist has changed
    //      and it's no longer the same unit

    let nSelected = playerHelper.getActivePartFromQuery(location);
    if (nSelected >= nPlaylist.items.length) {
      nSelected = 0;
    }

    if (nSelected !== selected) {
      // case # 1
      playerHelper.setActivePartInQuery(nextProps.history, nSelected);
      nextProps.onSelectedChange(nPlaylist.items[nSelected].unit);
      return { selected: nSelected, playlist: nPlaylist };
    }

    if (
      playlist
      && nPlaylist
      && playlist.items[selected]
      && nPlaylist.items[selected]
      && playlist.items[selected].unit
      && nPlaylist.items[selected].unit
      && playlist.items[selected].unit !== nPlaylist.items[selected].unit
    ) {
      // case # 2
      nextProps.onSelectedChange(nPlaylist.items[nSelected].unit);
    }

    return { playlist: nPlaylist };
  }

  shouldComponentUpdate(nextProps) {
    const { collection, uiLanguage, contentLanguage, location, prevLink } = nextProps;

    const
      {
        collection: oldCollection,
        uiLanguage: oldUiLanguage,
        contentLanguage: oldContentLanguage,
        location: oldLocation,
        prevLink: oldPrevLink,
      }                                = this.props;
    const { playlist }                 = this.state;
    const { language: playerLanguage } = playlist;

    const preferredMT     = playerHelper.restorePreferredMediaType();
    const prevMediaType   = playerHelper.getMediaTypeFromQuery(oldLocation);
    const newMediaType    = playerHelper.getMediaTypeFromQuery(location, preferredMT);
    const prevActivePart  = playerHelper.getActivePartFromQuery(oldLocation);
    const newActivePart   = playerHelper.getActivePartFromQuery(location);
    const newItemLanguage = playerHelper.getLanguageFromQuery(location, playerLanguage);

    return !(
      oldUiLanguage === uiLanguage
      && oldContentLanguage === contentLanguage
      && prevMediaType === newMediaType
      && prevActivePart === newActivePart
      && newItemLanguage === playerLanguage
      && prevLink === oldPrevLink
      && isEqual(collection, oldCollection)
    );
  }

  handleSelectedChange = selected => {
    const { history } = this.props;
    playerHelper.setActivePartInQuery(history, selected);
  };

  handleLanguageChange = (e, language) => {
    const { history } = this.props;
    playerHelper.setLanguageInQuery(history, language);
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
    const { PlayListComponent, uiLanguage, nextLink, prevLink, history } = this.props;
    const { playlist, selected, embed }                                  = this.state;

    if (!playlist
      || !Array.isArray(playlist.items)
      || playlist.items.length === 0
      || playlist.language === undefined
    ) {
      return null;
    }

    const isAudio = playlist.items[selected].mediaType === MT_AUDIO;

    return <Grid.Row
      className={clsx('', {
        'layout--is-audio': isAudio,
      })}
    >
      <Grid.Column id="avbox__player" mobile={16} tablet={10} computer={10}>
        <AVPlaylistPlayer
          items={playlist.items}
          selected={selected}
          language={playlist.language}
          uiLanguage={uiLanguage}
          onSelectedChange={this.handleSelectedChange}
          onLanguageChange={this.handleLanguageChange}
          onSwitchAV={this.handleSwitchAV}
          history={history}
        />
      </Grid.Column>
      { !embed &&
        <Grid.Column id="avbox__playlist" className="avbox__playlist" mobile={16} tablet={6} computer={6}>
          <PlayListComponent
            playlist={playlist}
            selected={selected}
            language={uiLanguage}
            onSelectedChange={this.handleSelectedChange}
            nextLink={nextLink}
            prevLink={prevLink}
          />
        </Grid.Column>
      }
    </Grid.Row>
  }
}

export default withRouter(withNamespaces()(PlaylistAVBox));
