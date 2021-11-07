import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

import { getQuery } from '../../helpers/url';

const activeFromLocation = location => {
  if (location.state && location.state.active)
    return location.state.active;

  const { activeTab = '' } = getQuery(location);
  return activeTab;
};

const activeFromDefault = items => (items.length > 0 ? items[0].name : null);

const TabsMenu = ({ items = [], active = '' }) => {
  const location = useLocation();

  const computedActive = active
    || activeFromLocation(location)
    || activeFromDefault(items);

  const [internalActive, setInternalActive] = useState(computedActive);
  const handleActiveChange                  = useCallback((e, { name }) => setInternalActive(name), []);

  const activeItem = items.find(x => x.name === internalActive);

  return (
    <div className="unit-materials">
      <Menu tabular secondary pointing color="blue" className="no_print">
        {
          items.filter(x => !!x).map(item => {
            const { name, label } = item;
            return (
              <Menu.Item
                key={name}
                name={name}
                className={`tab-${name}`}
                active={internalActive === name}
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
};

TabsMenu.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    component: PropTypes.node.isRequired,
  })),
  active: PropTypes.string,
};

export default TabsMenu;
