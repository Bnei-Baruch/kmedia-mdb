import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Menu } from 'semantic-ui-react';

import { actions as lessonsActions } from '../../../redux/modules/lessons';
import { actions as filterActions } from '../../../redux/modules/filters';
import * as shapes from '../../shapes';
import NavLink from '../../Language/MultiLanguageNavLink';
import SectionHeader from '../../shared/SectionHeader';
import Daily from './tabs/Daily/Container';
import Series from './tabs/Series/Container';
import Lectures from './tabs/Lectures/Container';

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

const MainPage = ({ location, match, t }) => {
  const dispatch = useDispatch();

  const setTab         = useCallback(tab => dispatch(lessonsActions.setTab(tab)), [dispatch]);
  const resetNamespace = useCallback(tab => dispatch(filterActions.resetNamespace(tab)), [dispatch]);

  const tab = match.params.tab || tabs[0];

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

  useEffect(() => {
    if (!location.search) {
      resetNamespace(`lessons-${tab}`);
    }
  }, [location.search, resetNamespace]);

  useEffect(() => {
    setTab(tab);
  }, [setTab, tab]);

  return (
    <div>
      <SectionHeader section="lessons" submenuItems={submenuItems} />
      {content(tab)}
    </div>
  );
};

MainPage.propTypes = {
  location: shapes.HistoryLocation.isRequired,
  match: shapes.RouterMatch.isRequired,
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(MainPage);
