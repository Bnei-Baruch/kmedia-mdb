import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

import * as shapes from '../shapes';

const activeFromLocation = location => location.state ? location.state.active : '';

const activeFromDefault = items => (items.length > 0 ? items[0].name : null);

const TabsMenu = ({location, items = [], active = ''}) => {
  const computedActive = active
      || activeFromLocation(location)
      || activeFromDefault(items);

  const [internalActive, setInternalActive] = useState(computedActive);

  const handleActiveChange = (e, { name }) => setInternalActive(name);

  const activeItem = items.find(x => x.name === internalActive);

  return (
    <div className="tabs-menu">
      <Menu secondary pointing color="blue">
        {
          items.map((item) => {
            const { name, label } = item;
            return (
              <Menu.Item
                key={name}
                name={name}
                className={`tab-${name}`}
                active={active === name}
                onClick={handleActiveChange}
              >
                {label}
              </Menu.Item>
            );
          })
        }
      </Menu>
      {activeItem ? activeItem.component : null}
    </div>
  );
}

TabsMenu.propTypes = {
  location: shapes.HistoryLocation.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    component: PropTypes.node.isRequired,
  })),
  active: PropTypes.string,
};

export default withRouter(TabsMenu);
