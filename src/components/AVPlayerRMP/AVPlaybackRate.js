import React, { Component } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { Dropdown } from 'semantic-ui-react';
import classNames from 'classnames';

export default class AVPlaybackRate extends Component {
  static propTypes = {
    onSelect: PropTypes.func,
    defaultValue: PropTypes.string,
    upward: PropTypes.bool,
  };

  static defaultProps = {
    onSelect: noop,
    defaultValue: '1x',
    upward: true,
  };

  handleChange = (e, data) =>
    this.props.onSelect(e, data.value);

  render() {
    const { languages, defaultValue, upward } = this.props;

    const options = ['1x', '1.5x', '2x']
      .map(x => ({ value: x, text: x }));

    return (
      <div style={{marginRight: '5px'}}>
        <Dropdown
          floating
          scrolling
          upward={upward}
          icon={null}
          selectOnBlur={false}
          options={options}
          defaultValue={defaultValue}
          onChange={this.handleChange}
          className={classNames('player-button')}
        />
      </div>
    );
  }
}
