import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';

import { MT_AUDIO, MT_VIDEO } from '../../../helpers/consts';
import playerHelper from '../../../helpers/player';
import * as shapes from '../../shapes';
import AVPlaylistPlayerRMP from '../../AVPlayerRMP/AVPlaylistPlayerRMP';

class FullVideoBox extends Component {

  static propTypes = {
    PlayListComponent: PropTypes.any,
    language: PropTypes.string.isRequired,
    collection: shapes.GenericCollection.isRequired,
    activePart: PropTypes.number,
    onActivePartChange: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    activePart: 0,
    PlayListComponent: null
  };

  componentWillMount() {
    const { collection, language } = this.props;
    this.setPlaylist(collection, MT_VIDEO, language);
  }

  componentWillReceiveProps(nextProps) {
    const { collection, language } = nextProps;
    const { collection: oldCollection, language: oldLanguage } = this.props;
    if (oldCollection !== collection || oldLanguage !== language) {
      this.setPlaylist(collection, MT_VIDEO, language);
    }
  }

  setPlaylist = (collection, mediaType, language, cb) => {
    const playlist = playerHelper.playlist(collection, mediaType, language);
    this.setState({ playlist }, cb);
  };

  handleChangeLanguage = (e, language) => {
    const { playlist } = this.state;
    const { activePart, collection } = this.props;

    const playableItem = playlist.items[activePart];

    if (language !== playableItem.language) {
      this.setPlaylist(collection, playableItem.mediaType, language);
    }
  }

  handleSwitchAV = () => {
    const { collection, activePart } = this.props;
    const { playlist } = this.state;
    const activeItem = playlist.items[activePart];
    if (activeItem.mediaType === MT_AUDIO && activeItem.availableMediaTypes.includes(MT_VIDEO)) {
      this.setPlaylist(collection, MT_VIDEO, activeItem.language);
    } else if (activeItem.mediaType === MT_VIDEO && activeItem.availableMediaTypes.includes(MT_AUDIO)) {
      this.setPlaylist(collection, MT_AUDIO, activeItem.language);
    }
  };

  handlePartClick = (e, data) =>
    this.props.onActivePartChange(parseInt(data.name, 10));

  render() {
    const { t, activePart, collection, language, PlayListComponent } = this.props;
    const { playlist } = this.state;

    return (
      <Grid.Row className="video_box">
        <Grid.Column width={10}>
          <AVPlaylistPlayerRMP
            language={language}
            playlist={playlist}
            activePart={activePart}
            onActivePartChange={this.props.onActivePartChange}
            onLanguageChange={this.handleChangeLanguage}
            onSwitchAV={this.handleSwitchAV}
            t={t}
          />
        </Grid.Column>
        <Grid.Column className="player_panel" width={6}>
          <PlayListComponent
            collection={collection}
            activePart={activePart}
            t={t}
            onItemClick={this.handlePartClick}
          />
        </Grid.Column>
      </Grid.Row>
    );
  }
}

export default FullVideoBox;
