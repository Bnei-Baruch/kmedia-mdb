import React from 'react';
import PropTypes from 'prop-types';
import { useLocation, useParams } from 'react-router';
import { withNamespaces } from 'react-i18next';
import { Menu } from 'semantic-ui-react';

import NavLink from '../Language/MultiLanguageNavLink';
import SectionHeader from './SectionHeader';
import { actions as filterActions } from '../../redux/modules/filters';

const MainTabPage = ({ tabs, content, setTab, section, t }) => {
  const params   = useParams();
  const location = useLocation();

  const tab = params.tab || tabs[0];

  const submenuItems = tabs.map(x => (
    <Menu.Item
      key={x}
      name={x}
      as={NavLink}
      to={`/${section}/${x}`}
      active={tab === x}
    >
      {t(`${section}.tabs.${x}`)}
    </Menu.Item>
  ));

  if (!location.search) {
    filterActions.resetNamespace(`${section}-${tab}`);
  }

  setTab(tab);

  return (
    <div>
      <SectionHeader section={section} submenuItems={submenuItems} />
      {content(tab)}
    </div>
  );
};

MainTabPage.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
  content: PropTypes.func.isRequired,
  setTab: PropTypes.func.isRequired,
  section: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(MainTabPage);
