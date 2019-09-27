import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Menu } from 'semantic-ui-react';

import { actions as lessonsActions } from '../../../redux/modules/lessons';
import { actions as filterActions } from '../../../redux/modules/filters';
import NavLink from '../../Language/MultiLanguageNavLink';
import SectionHeader from '../../shared/SectionHeader';
import Daily from './tabs/Daily/Container';
import Series from './tabs/Series/Container';
import Lectures from './tabs/Lectures/Container';
import { useLocation, useParams } from 'react-router';

// needed in routesSSRData
export const tabs = [
  'daily',
  'virtual',
  'lectures',
  'women',
  'rabash',
  // 'children',
  'series',
];

const content = (active) => {
  let content = null;
  switch (active) {
  case 'daily':
    content = <Daily />;
    break;
  case 'virtual':
  case 'lectures':
  case 'women':
  case 'rabash':
    // case 'children':
    content = <Lectures tab={active} />;
    break;
  case 'series':
    content = <Series />;
    break;
  default:
    content = <h1>Page not found</h1>;
    break;
  }
  return content;
};

const MainPage = ({ t }) => {
  const params   = useParams();
  const location = useLocation();

  const tab = params.tab || tabs[0];

  const submenuItems = tabs.map(x => (
    <Menu.Item
      key={x}
      name={x}
      as={NavLink}
      to={`/lessons/${x}`}
      active={tab === x}
    >
      {t(`lessons.tabs.${x}`)}
    </Menu.Item>
  ));

  const dispatch = useDispatch();

  useEffect(() => {
    if (!location.search) {
      const resetNamespace = tab => dispatch(filterActions.resetNamespace(tab));
      resetNamespace(`lessons-${tab}`);
    }
  }, [location.search]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const setTab = tab => dispatch(lessonsActions.setTab(tab));
    setTab(tab);
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <SectionHeader section="lessons" submenuItems={submenuItems} />
      {content(tab)}
    </div>
  );
};

MainPage.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(MainPage);
