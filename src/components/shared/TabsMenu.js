import React, { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useLocation, Link } from 'react-router-dom';

import { getQuery } from '../../helpers/url';

const paramsFromLocation = location => {
  if (location.state && location.state.active)
    return location.state.active;

  const { activeTab: activeLocation = '', srchstart } = getQuery(location);
  return { activeLocation, isHighLighted: !!srchstart };
};

const activeFromDefault = items => (items.length > 0 ? items[0].name : null);

const TabsMenu = ({ items = [], active = '' }) => {
  const location                          = useLocation();
  const { activeLocation, isHighLighted } = paramsFromLocation(location);

  const computedActive = active
    || activeLocation
    || activeFromDefault(items);

  const [internalActive, setInternalActive] = useState(computedActive);
  const handleActiveChange                  = useCallback((e, { name }) => setInternalActive(name), []);

  const scrollRef = useRef();

  const activeItem = items.find(x => x.name === internalActive);

  useEffect(() => {
    if (!isHighLighted && activeLocation && scrollRef.current?.scrollIntoView) {
      setTimeout(() => {
        scrollRef.current && scrollRef.current.scrollIntoView();
      }, 150);
    }
  }, [scrollRef, activeLocation, isHighLighted]);

  return (
    <div className="unit-materials">
      <nav ref={scrollRef} className="flex border-b border-gray-200 no_print">
        {
          items.map(item => {
            const { name, label } = item;
            return (
              <Link
                key={name}
                to={`?activeTab=${name}`}
                className={`tab-${name} px-4 py-2 small font-medium border-b-2 ${internalActive === name ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                onClick={e => handleActiveChange(e, { name })}
              >{label}</Link>
            );
          })
        }
      </nav>
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
