import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withMediaProps } from 'react-media-player';
import { Icon } from 'semantic-ui-react';

class AVSpinner extends Component {
  static propTypes = {
    media: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
    }).isRequired,
  };

  shouldComponentUpdate(nextProps) {
    return this.props.media.isLoading !== nextProps.media.isLoading;
  }

  render() {
    const { media } = this.props;

    if (!media.isLoading) {
      return null;
    }

    return (
      <Icon
        loading
        name="spinner"
        color="orange"
        size="huge"
      />
    );
  }
}

export default withMediaProps(AVSpinner);
