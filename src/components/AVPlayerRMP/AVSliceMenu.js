import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Menu, Icon } from 'semantic-ui-react';
import { PLAYER_MODE } from './constants';
import { playerModeProp } from './propTypes';

const inViewOptions = [
  { key: 'edit', icon: 'edit', text: 'Edit', value: 'edit' },
];

const inEditOptions = [
  { key: 'view', icon: 'hand paper', text: 'View', value: 'view' }
];

export default class AVSliceMenu extends Component {
  static propTypes = {
    playerMode: playerModeProp.isRequired,
    onEdit: PropTypes.func.isRequired,
    onView: PropTypes.func.isRequired,
  };

  handleItemClick = (e, item) => {
    const { onEdit, onView } = this.props;
    switch (item.name) {
    case 'edit':
      onEdit();
      break;
    case 'view':
      onView();
      break;
    default:
    }
  };

  render() {
    const { playerMode } = this.props;

    let options = [];

    if (playerMode === PLAYER_MODE.SLICE_EDIT) {
      options = inEditOptions;
    } else if (playerMode === PLAYER_MODE.SLICE_VIEW) {
      options = inViewOptions;
    }

    return (
      <div className="player-control-slice-menu">
        <Menu compact inverted vertical>
          <Menu.Item header>Slice Menu</Menu.Item>
          {
            options.map(option => (
              <Menu.Item key={option.key} name={option.key} onClick={this.handleItemClick}>
                <Icon name={option.icon} />
                { option.text }
              </Menu.Item>
            ))
          }
        </Menu>
      </div>
    );
  }
}
