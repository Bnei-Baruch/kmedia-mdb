import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Container, Icon, Menu } from 'semantic-ui-react';

import { filterPropShape } from '../shapes';

class FilterMenu extends PureComponent {

  static propTypes = {
    items: PropTypes.arrayOf(filterPropShape).isRequired,
    active: PropTypes.string,
    onChoose: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    namespace: PropTypes.string.isRequired,
    rightItems: PropTypes.arrayOf(PropTypes.node),
  };

  static defaultProps = {
    active: '',
    rightItems: null,
  };

  handleClick = (e, data) => {
    this.props.onChoose({ name: data.name });
  };

  render() {
    const { items, rightItems, active, t, namespace } = this.props;

    return (
      <Menu secondary pointing color="blue" className="index-filters" size="large">
        <Container className="padded horizontally">
          <Menu.Item header content={t(`filters.${namespace}.by`)} />
          {
            items.map(item => (
              <Menu.Item
                key={item.name}
                name={item.name}
                active={item.name === active}
                onClick={this.handleClick}>
                {t(`filters.${item.name}.label`)}
                <Icon name="dropdown" />
              </Menu.Item>
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
