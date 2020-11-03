import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {Menu} from 'semantic-ui-react';

import * as shapes from '../shapes';
import {getQuery} from "../../helpers/url";

const activeFromLocation = location => {
  if (location.state && location.state.active)
    return location.state.active;
  const {activeTab = ''} = getQuery(location);
  return activeTab;
}

const activeFromDefault = items => (items.length > 0 ? items[0].name : null);

const TabsMenu = ({location, items = [], active = ''}) => {
  const computedActive = active
    || activeFromLocation(location)
    || activeFromDefault(items);

  const [internalActive, setInternalActive] = useState(computedActive);

  const handleActiveChange = (e, {name}) => setInternalActive(name);

  const activeItem = items.find(x => x.name === internalActive);

  return (
    <div className="menu">
      <Menu secondary pointing color="blue">
        {
          items.map((item) => {
            const {name, label} = item;
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
