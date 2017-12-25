import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Media } from 'react-media-player';

import { MT_AUDIO } from '../../helpers/consts';
import AVPlayerRMP from './AVPlayerRMP';

class AVPlaylistPlayerRMP extends Component {

  static propTypes = {
    playlist: PropTypes.object.isRequired,
    activePart: PropTypes.number.isRequired,
    onActivePartChange: PropTypes.func.isRequired,
    onLanguageChange: PropTypes.func.isRequired,
    onSwitchAV: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  state = {
    autoPlay: false
  };

  onFinish = () => {
    const { activePart, onActivePartChange, playlist } = this.props;
    if (activePart < playlist.items.length - 1) {
      onActivePartChange(activePart + 1);
    }
    this.setState({ autoPlay: true });
  };

  onNext = () => {
    const { activePart, onActivePartChange, playlist } = this.props;
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

  render() {
    const { t, activePart, playlist, onSwitchAV, onLanguageChange } = this.props;
    const { autoPlay } = this.state;

    const items = playlist.items;
    const currentItem = items[activePart];

    // hasNext, hasPrev are not trivial as checking the indexes due to fact
    // that in some languages there might be missing audio or video file.
    const hasNext = activePart < items.length - 1 && items.slice(activePart).some(f => !!f.src);
    const hasPrev = activePart > 0 && items.slice(0, activePart).some(f => !!f.src);

    return (
      <div
        className={classNames('avbox__player', {
          'avbox__player--is-audio': currentItem.mediaType === MT_AUDIO,
          'avbox__player--is-4x3': currentItem.film_date < '2014',
        })}
      >

        <div className="avbox__media-wrapper" >
          <Media>
            <AVPlayerRMP
              autoPlay={autoPlay}
              item={currentItem}
              onSwitchAV={onSwitchAV}
              languages={currentItem.availableLanguages}
              language={playlist.language}
              onLanguageChange={onLanguageChange}
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

