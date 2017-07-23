import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'semantic-ui-react';
import { translate } from 'react-i18next';
import { filterPropShape } from '../../shapes';
import FilterMenuItem from '../FilterMenuItem/FilterMenuItem';

class FilterMenu extends PureComponent {

  static propTypes = {
    items: PropTypes.arrayOf(filterPropShape).isRequired,
    active: PropTypes.string,
    onChoose: PropTypes.func,
    t: PropTypes.func.isRequired
  };

  static defaultProps = {
    active: '',
    onChoose: undefined
  };

  render() {
    const { items, active, onChoose, t } = this.props;
    return (
      <Menu secondary pointing color="blue" className="index-filters" size="large">
        {
          items.map(item => (
            <FilterMenuItem
              key={item.name}
              name={item.name}
              label={t(item.label)}
              isActive={item.name === active}
              onChoose={onChoose}
            />
          ))
        }
      </Menu>
    );
  }
}

export default translate('filters')(FilterMenu);
