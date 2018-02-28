import React, { Component } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { Dropdown } from 'semantic-ui-react';

const options = [
  { value: '2x', text: '2x' },
  { value: '1.5x', text: '1.5x' },
  { value: '1.25x', text: '1.25x' },
  { value: '1x', text: '1x' }];

export default class AVPlaybackRate extends Component {
  static propTypes = {
    onSelect: PropTypes.func,
    value: PropTypes.string,
  };

  static defaultProps = {
    onSelect: noop,
    value: '1x',
  };

  handleChange = (e, data) =>
    this.props.onSelect(e, data.value);

  render() {
    const { value } = this.props;

    return (
      <div className="mediaplayer__playback-rate">
        <Dropdown
          floating
          scrolling
          upward
          icon={null}
          selectOnBlur={false}
          options={options}
          value={value}
          onChange={this.handleChange}
          trigger={<button>{value}</button>}
        />
      </div>
    );
  }
}
