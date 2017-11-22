import React, { Component } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { Dropdown } from 'semantic-ui-react';
import classNames from 'classnames';

export default class AVPlaybackRate extends Component {
  static propTypes = {
    onSelect: PropTypes.func,
    value: PropTypes.string,
    upward: PropTypes.bool,
  };

  static defaultProps = {
    onSelect: noop,
    value: '1x',
    upward: true,
  };

  handleChange = (e, data) =>
    this.props.onSelect(e, data.value);

  render() {
    const { value, upward } = this.props;

    const options = ['1x', '1.5x', '2x']
      .map(x => ({ value: x, text: x }));

    return (
      <div className="mediaplayer__playback-rate">
        <Dropdown
          floating
          scrolling
          upward={upward}
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
