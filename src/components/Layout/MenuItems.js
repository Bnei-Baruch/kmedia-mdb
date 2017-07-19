import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Sidebar } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

const ITEMS = [
  { key: 'daily_lessons', name: 'Daily Lessons', to: '/lessons', },
  { key: 'tv_video_programs', name: 'TV & Video Programs', to: '/tv_shows', },
  { key: 'lectures_lessons', name: 'Lectures & Lessons', to: '/lectures', },
  { key: 'sources', name: 'Kabbalah Sources', to: '/sources', },
  { key: 'events', name: 'Events', to: '/events', },
  { key: 'books', name: 'Books', to: '/books', },
  { key: 'topics', name: 'Topics', to: '/topics', },
  { key: 'publications', name: 'Publications', to: '/publications', },
  { key: 'photos', name: 'Photos', to: '/photos', },
  { key: 'design', name: 'Design', to: '/design', },
].map(item =>
  <Menu.Item as={NavLink} activeClassName="active" key={item.name} to={item.to} content={item.name} />
);

const MenuItems = (props) => {
  const { simple, visible } = props;

  if (simple) {
    return (
      <Menu vertical fluid pointing color='blue'>
        {ITEMS}
      </Menu>
    );
  }

  return (
    <Sidebar pointing vertical as={Menu} animation="push" visible={visible}>
      {ITEMS}
    </Sidebar>
  );
};

MenuItems.propTypes = {
  simple: PropTypes.bool,
  visible: PropTypes.bool,
};

MenuItems.defaultProps = {
  simple: false,
  visible: false
};

export default MenuItems;
