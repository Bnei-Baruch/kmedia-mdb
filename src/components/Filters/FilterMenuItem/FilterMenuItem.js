import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Menu, Icon } from 'semantic-ui-react';

class FilterMenuItem extends PureComponent {

  static propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    isActive: PropTypes.bool,
    onChoose: PropTypes.func,
  };

  static defaultProps = {
    isActive: false,
    onChoose: undefined
  };

  render() {
    const { name, label, isActive, onChoose } = this.props;
    return <Menu.Item name={name} active={isActive} onClick={() => onChoose({ name })}>{label}<Icon name='dropdown'/></Menu.Item>;
  }
}


export default FilterMenuItem;
