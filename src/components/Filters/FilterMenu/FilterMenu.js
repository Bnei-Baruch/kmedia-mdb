import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'semantic-ui-react';
import { filterPropShape } from '../../shapes';
import FilterMenuItem from '../FilterMenuItem/FilterMenuItem';

class FilterMenu extends PureComponent {

  static propTypes = {
    items: PropTypes.arrayOf(filterPropShape).isRequired,
    active: PropTypes.string,
    onChoose: PropTypes.func
  };

  static defaultProps = {
    active: '',
    onChoose: undefined
  };

  render() {
    const { items, active, onChoose } = this.props;
    return (
      <Menu secondary pointing color="blue" className="index-filters" size="large">
        {
          items.map(item => (
            <FilterMenuItem
              key={item.name}
              name={item.name}
              label={item.label}
              isActive={item.name === active}
              onChoose={onChoose}
            />
          ))
        }
      </Menu>
    );
  }
}

export default FilterMenu;
