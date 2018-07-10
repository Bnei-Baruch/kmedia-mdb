import React, { Component } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { Dropdown } from 'semantic-ui-react';

const options = [
  { value: '2x', text: '2x' },
  { value: '1.5x', text: '1.5x' },
  { value: '1.25x', text: '1.25x' },
  { value: '1x', text: '1x' },
  { value: '0.75x', text: '0.75x' }];

export default class AVPlaybackRateMobile extends Component {
  static propTypes = {
    onSelect: PropTypes.func,
    value: PropTypes.string,
  };

  static defaultProps = {
    onSelect: noop,
    value: '1x',
  };

  handleChange = (e) => 
    this.props.onSelect(e, e.currentTarget.value);

  render() {
    const { value } = this.props;

    return (
      <div className="mediaplayer__playback-rate">
          <select value={value} onChange={this.handleChange}>
          {
            options.map(x => (
              <option key={x.value} value={x.value}>
                {x.text}
              </option>
            ))
          }
        </select>

      </div>
    );
  }
}
