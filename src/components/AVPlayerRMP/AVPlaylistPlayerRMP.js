import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Media } from 'react-media-player';

import { MT_AUDIO, MT_VIDEO } from '../../helpers/consts';
import playerHelper from '../../helpers/player';
import * as shapes from '../shapes';
import AVPlayerRMP from './AVPlayerRMP';

class AVPlaylistPlayerRMP extends Component {

  static propTypes = {
    language: PropTypes.string.isRequired,
    collection: shapes.GenericCollection,
    activePart: PropTypes.number,
    onActivePartChange: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    activePart: 0,
  };

  state = {
    autoPlay: true
  };

  setPlaylist = (collection, mediaType, language, cb) => {
    const playlist = playerHelper.playlist(collection, mediaType, language);
    console.log(playlist);
    this.setState({ playlist }, cb);
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

  handleChangeLanguage = (e, language) => {
    const { playlist } = this.state;
    const { activePart, collection } = this.props;

    const playableItem = playlist.items[activePart];

    if (language !== playableItem.language) {
      this.setPlaylist(collection, playableItem.mediaType, language);
    }
  }

  handleLessonPartClick = (e, data) =>
    this.props.onActivePartChange(parseInt(data.name, 10));

  onFinish = () => {
    const { activePart, onActivePartChange } = this.props;
    const { playlist } = this.state;
    if (activePart < playlist.items.length - 1) {
      onActivePartChange(activePart + 1);
    }
    this.setState({ autoPlay: true });
  };

  onNext = () => {
    const { activePart, onActivePartChange } = this.props;
    const { playlist } = this.state;
    if (activePart < playlist.items.length - 1) {
      onActivePartChange(activePart + 1);
    }
  };

  onPrev = () => {
    const { activePart, onActivePartChange } = this.props;
    if (activePart > 0) {
      onActivePartChange(activePart - 1);
    }
  };

  onPlay = () => this.setState({ autoPlay: true });

  onPause = () => this.setState({ autoPlay: false });

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

  render() {
    const { t, activePart } = this.props;
    const { autoPlay, playlist }  = this.state;

    const items = playlist.items;
    const currentItem = items[activePart];

    // hasNext, hasPrev are not trivial as checking the indexes due to fact
    // that in some languages there might be missing audio or video file.
    const hasNext = activePart < items.length - 1 && items.slice(activePart).some(f => !!f.src);
    const hasPrev = activePart > 0 && items.slice(0, activePart).some(f => !!f.src);

    return (
      <div className="video_player">
        <div className="video_position">
          <Media>
            <AVPlayerRMP
              autoPlay={autoPlay}
              item={currentItem}
              onSwitchAV={this.handleSwitchAV}
              languages={currentItem.availableLanguages}
              language={playlist.language}
              onLanguageChange={this.handleChangeLanguage}
              t={t}
              // Playlist props
              showNextPrev
              onFinish={this.onFinish}
              hasNext={hasNext}
              hasPrev={hasPrev}
              onPrev={this.onPrev}
              onNext={this.onNext}
              onPause={this.onPause}
              onPlay={this.onPlay}
            />
          </Media>
        </div>
      </div>
    );
  }
}

export default AVPlaylistPlayerRMP;

