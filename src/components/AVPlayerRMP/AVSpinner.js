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

  shouldComponentUpdate({ media }) {
    return this.props.media.isLoading !== media.isLoading;
  }


  render() {
    const { media } = this.props;

    if (!media.isLoading) {
      return <div />;
    }

    return (
      <Icon name={'spinner'}
            loading
            color={'orange'}
            size="huge"/>
    );
  }
}

export default withMediaProps(AVSpinner);
