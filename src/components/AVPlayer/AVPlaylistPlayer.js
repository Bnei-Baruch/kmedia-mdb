import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Media } from 'react-media-player';

import { MT_AUDIO } from '../../helpers/consts';
import AVPlayer from './AVPlayer';

class AVPlaylistPlayer extends Component {

  static propTypes = {
    items: PropTypes.array.isRequired,
    selected: PropTypes.number.isRequired,
    language: PropTypes.string.isRequired,
    onSelectedChange: PropTypes.func.isRequired,
    onLanguageChange: PropTypes.func.isRequired,
    onSwitchAV: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  state = {
    autoPlay: false
  };

  onFinish = () => {
    const { selected, onSelectedChange, items } = this.props;
    if (selected < items.length - 1) {
      onSelectedChange(selected + 1);
    }
    this.setState({ autoPlay: true });
  };

  onNext = () => {
    const { selected, onSelectedChange, items } = this.props;
    if (selected < items.length - 1) {
      onSelectedChange(selected + 1);
    }
  };

  onPrev = () => {
    const { selected, onSelectedChange } = this.props;
    if (selected > 0) {
      onSelectedChange(selected - 1);
    }
  };

  onPlay  = () => this.setState({ autoPlay: true });
  onPause = () => this.setState({ autoPlay: false });

  render() {
    const { t, selected, items, language, onSwitchAV, onLanguageChange } = this.props;
    const { autoPlay }                                                     = this.state;

    const currentItem = items[selected];

    // hasNext, hasPrev are not trivial as checking the indexes due to fact
    // that in some languages there might be missing audio or video file.
    const hasNext = selected < items.length - 1 && items.slice(selected).some(f => !!f.src);
    const hasPrev = selected > 0 && items.slice(0, selected).some(f => !!f.src);

    return (
      <div
        className={classNames('avbox__player', {
          'avbox__player--is-audio': currentItem.mediaType === MT_AUDIO,
          'avbox__player--is-4x3': currentItem.film_date < '2014',
        })}
      >
        <div className="avbox__media-wrapper">
          <Media>
            <AVPlayer
              autoPlay={autoPlay}
              item={currentItem}
              onSwitchAV={onSwitchAV}
              languages={currentItem.availableLanguages}
              language={language}
              preImageUrl={currentItem.preImageUrl}
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

export default AVPlaylistPlayer;
