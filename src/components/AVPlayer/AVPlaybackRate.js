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

export default class AVPlaybackRate extends Component {
  static propTypes = {
    onSelect: PropTypes.func,
    value: PropTypes.string,
    onDropdownOpenedChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    onSelect: noop,
    value: '1x',
  };

  handleChange = (e, data) => this.props.onSelect(e, data.value);

  handleOnOpen = () => this.props.onDropdownOpenedChange(true);

  handleOnClose = () => this.props.onDropdownOpenedChange(false);

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
          trigger={<button type="button">{value}</button>}
          onOpen={this.handleOnOpen}
          onClose={this.handleOnClose}
        />
      </div>
    );
  }
}
