import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Menu, Input, Container } from 'semantic-ui-react';

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
        <Container className='padded horizontally'>
        {
          items.map(item => (
            <FilterMenuItem
              key={item.name}
              name={item.name}
              label={t(`filters.${item.name}.label`)}
              isActive={item.name === active}
              onChoose={onChoose}
            />
          ))
        }
        {/*<Menu.Item>
          <Input size='small' icon icon='search' placeholder='Search Daily Lessons...' />
        </Menu.Item>*/}
        </Container>
      </Menu>
    );
  }
}

export default translate()(FilterMenu);
