import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withMediaProps} from 'react-media-player';

class AVPreImage extends Component {
  static propTypes = {
    media: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      isPlaying: PropTypes.bool.isRequired,
    }).isRequired,
    src: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      imageVisibility: 'hidden'
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.src !== nextProps.src) {
      this.setState({imageVisibility: 'hidden'});
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.media.isLoading !== nextProps.media.isLoading ||
      this.props.media.isPlaying !== nextProps.media.isPlaying ||
      this.state.imageVisibility !== nextProps.imageVisibility;
  }

  handleImageLoaded = () => {
    this.setState({imageVisibility: 'visible'});
  };


  render() {
    const {media} = this.props;

    if ((media.isLoading || !media.isPlaying) && (media.currentTime === 0)) {
      return (
        <img
          src={this.props.src}
          style={ {width: '100%', height: '100%', visibility: this.state.imageVisibility} }
          onLoad={this.handleImageLoaded}
          alt={''}
        />
      );
    }
    return <div/>;
  }
}

export default withMediaProps(AVPreImage);
