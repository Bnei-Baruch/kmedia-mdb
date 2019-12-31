import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Menu } from 'semantic-ui-react';
import { useLocation, useParams } from 'react-router';

import { actions } from '../../../redux/modules/publications';
import { actions as filterActions } from '../../../redux/modules/filters';
import NavLink from '../../Language/MultiLanguageNavLink';
import SectionHeader from '../../shared/SectionHeader';
import Articles from './tabs/Articles/List';
import Blog from './tabs/Blog/Container';
import Twitter from './tabs/Twitter/Container';
import AudioBlog from './tabs/AudioBlog/Container';

export const tabs = [
  'blog',
  'twitter',
  'articles',
  'audio-blog'
];

const getContent = (active) => {
  switch (active) {
  case 'articles':
    return <Articles />;
  case 'blog':
    return <Blog namespace="publications-blog" />;
  case 'twitter':
    return <Twitter namespace="publications-twitter" />;
  case 'audio-blog':
    return <AudioBlog />;
  default:
    return <h1>Page not found</h1>;
  }
}

const MainPage = ({ t }) => {
  
  const params   = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const currentTab = params.tab || tabs[0];

  // clear filters if location search parameter is changed by Menu click
  useEffect(() => {
    if (!location.search) {
      const resetNamespace = tab => dispatch(filterActions.resetNamespace(tab));
      resetNamespace(`publications-${currentTab}`);
    }
  }, [dispatch, location.search, currentTab]); 
  
  useEffect(() => {
    const setTab = tab => dispatch(actions.setTab(tab));
    setTab(currentTab);
  }, [dispatch, currentTab]); 

  const submenuItems = tabs.map(x => (
    <Menu.Item
      key={x}
      name={x}
      as={NavLink}
      to={`/publications/${x}`}
      active={currentTab === x}
    >
      {t(`publications.tabs.${x}`)}
    </Menu.Item>
  ));

  return (
    <div>
      <SectionHeader section="publications" submenuItems={submenuItems} />
      {getContent(currentTab)}
    </div>
  );
}

MainPage.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(MainPage);
