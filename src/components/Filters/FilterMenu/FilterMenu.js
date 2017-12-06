import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Container, Menu } from 'semantic-ui-react';

import { filterPropShape } from '../../shapes';
import FilterMenuItem from '../FilterMenuItem/FilterMenuItem';

class FilterMenu extends PureComponent {

  static propTypes = {
    items: PropTypes.arrayOf(filterPropShape).isRequired,
    active: PropTypes.string,
    onChoose: PropTypes.func,
    t: PropTypes.func.isRequired,
    namespace: PropTypes.string.isRequired,
    rightItems: PropTypes.arrayOf(PropTypes.node),
  };

  static defaultProps = {
    active: '',
    onChoose: undefined,
    rightItems: null,
  };

  render() {
    const { items, rightItems, active, onChoose, t, namespace } = this.props;

    return (
      <Menu secondary pointing color="blue" className="index-filters" size="large">
        <Container className="padded horizontally">
          <Menu.Item header content={t(`filters.${namespace}.by`)} />
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
          {
            rightItems ? <Menu.Menu position="right" children={rightItems} /> : null
          }
        </Container>
      </Menu>
    );
  }
}

export default translate()(FilterMenu);
