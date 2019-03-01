import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image } from 'semantic-ui-react';

import imagePlaceholder from '../../images/image.png';

// An adaptation of https://github.com/socialtables/react-image-fallback
// for react semantic-ui
class FallbackImage extends Component {

  static propTypes = {
    src: PropTypes.string,
    fallbackImage: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.array])),
    onLoad: PropTypes.func,
    onError: PropTypes.func
  };

  static defaultProps = {
    fallbackImage: [imagePlaceholder],
  };

  constructor(props) {
    super(props);
    this.state = {
      imageSource: props.src
    };
  }

  componentDidMount() {
    this.displayImage = new window.Image();
    this.setDisplayImage(this.props.src, this.props.fallbackImage);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.src !== this.props.src) {
      this.setDisplayImage(nextProps.src, nextProps.fallbackImage);
    }
  }

  componentWillUnmount() {
    if (this.displayImage) {
      this.displayImage.onerror = null;
      this.displayImage.onload  = null;
      this.displayImage         = null;
    }
  }

  setDisplayImage = (image, fallbacks) => {
    const imagesArray = [image].concat(fallbacks).filter(fallback => !!fallback);

    this.displayImage.onerror = () => {
      if (imagesArray.length > 2 && typeof imagesArray[1] === 'string') {
        const updatedFallbacks = imagesArray.slice(2);
        this.setDisplayImage(imagesArray[1], updatedFallbacks);
        return;
      }

      this.setState({ imageSource: imagesArray[1] || null }, () => {
        if (this.props.onError) {
          this.props.onError(this.props.src);
        }
      });
    };

    this.displayImage.onload = () => {
      this.setState({
        imageSource: imagesArray[0]
      }, () => {
        if (this.props.onLoad) {
          this.props.onLoad(imagesArray[0]);
        }
      });
    };

    if (typeof imagesArray[0] === 'string') {
      this.displayImage.src = imagesArray[0];
    } else {
      this.setState({
        imageSource: imagesArray[0]
      }, () => {
        if (this.props.onLoad) {
          this.props.onLoad(imagesArray[0]);
        }
      });
    }
  };

  render() {
    if (typeof this.state.imageSource !== 'string') {
      return this.state.imageSource;
    }

    const { fallbackImage, onLoad, onError, width = 'auto', height = 'auto', ...rest } = this.props;
    return <Image {...rest}
                  src={this.state.imageSource}
                  style={{ 'width': `${width}px`, 'height': `${height}px` }} />;
  }
}

export default FallbackImage;
