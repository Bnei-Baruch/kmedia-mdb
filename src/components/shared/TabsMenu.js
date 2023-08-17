import React, { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { Menu, Ref } from 'semantic-ui-react';

import { getQuery } from '../../helpers/url';
import Link from '../Language/MultiLanguageLink';

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

  const renderTab = item => {
    const { name, label } = item;
    const _props          = {
      name: name,
      className: `tab-${name}`,
      active: internalActive === name,
      onClick: handleActiveChange,
      content: label
    };
    if (!_props.active && name === 'transcription') {
      _props.as     = Link;
      const _search = new URLSearchParams(location.search);
      _search.set('activeTab', name);
      _props.to = { pathname: location.pathname, search: _search.toString() };
    }
    return (<Menu.Item key={name} {..._props} />
    );
  };

  return (
    <div className="unit-materials">
      <Ref innerRef={scrollRef}>
        <Menu tabular secondary pointing color="blue" className="no_print">
          {items.map(renderTab)}
        </Menu>
      </Ref>
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
