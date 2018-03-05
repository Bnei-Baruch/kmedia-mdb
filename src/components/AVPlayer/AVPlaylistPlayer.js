import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Media } from 'react-media-player';

import { MT_AUDIO } from '../../helpers/consts';
import { selectors as system } from '../../redux/modules/system';
import AVMobileCheck from './AVMobileCheck';

class AVPlaylistPlayer extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    selected: PropTypes.number.isRequired,
    language: PropTypes.string.isRequired,
    autoPlayAllowed: PropTypes.bool.isRequired,
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
    const { t, selected, items, language, onSwitchAV, onLanguageChange, autoPlayAllowed } = this.props;
    const { autoPlay }                                                                    = this.state;

    const currentItem = items[selected];

    // hasNext, hasPrev are not trivial as checking the indexes due to fact
    // that in some languages there might be missing audio or video file.
    const hasNext = selected < items.length - 1 && items.slice(selected).some(f => !!f.src);
    const hasPrev = selected > 0 && items.slice(0, selected).some(f => !!f.src);

    return (
      <div
        className={classNames('avbox__player', {
          'avbox__player--is-audio': currentItem.mediaType === MT_AUDIO,
          'avbox__player--is-4x3': currentItem.unit.film_date < '2014',
          'mobile-device': !autoPlayAllowed,
        })}
      >
        <div className="avbox__media-wrapper">
          <Media>
            <AVMobileCheck
              autoPlay={autoPlay}
              item={currentItem}
              onSwitchAV={onSwitchAV}
              languages={currentItem.availableLanguages}
              language={language}
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

const mapState = state => ({
  autoPlayAllowed: system.getAutoPlayAllowed(state.system),
});

export default connect(mapState)(AVPlaylistPlayer);
