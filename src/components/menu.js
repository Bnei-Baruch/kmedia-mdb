import React from 'react';
import { Sidebar, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const menuItems = [
  { key: 'daily_lessons', name: 'Daily Lessons', to: '/home', },
  { key: 'tv_video_programs', name: 'TV & Video Programs', to: '/home', },
  { key: 'lectures_lessons', name: 'Lectures & Lessons', to: '/home', },
  { key: 'sources', name: 'Sources', to: '/home', },
  { key: 'events', name: 'Events', to: '/home', },
  { key: 'books', name: 'Books', to: '/home', },
  { key: 'topics', name: 'Topics', to: '/home', },
  { key: 'publications', name: 'Publications', to: '/home', },
  { key: 'photos', name: 'Photos', to: '/home', },
];

const isActive = (active, key) => active === key;
const getColor = (active, key) => isActive() ? 'violet' : '';

const MenuItems = ({ active, simple, visible }) => {
  const menu_items = menuItems.map((item) =>
    <Menu.Item as={Link} key={item.key} to={item.to} active={isActive(active, item.key)} color={getColor(active, item.key)}>{item.name}</Menu.Item>
  );
  if (simple) {
    return (
      <Menu vertical fluid pointing>{menu_items}</Menu>
    );
  } else {
    return (
      <Sidebar as={Menu} animation="push" visible={visible} pointing vertical>
        {menu_items}
      </Sidebar>
    );
  }
};

export default MenuItems;
