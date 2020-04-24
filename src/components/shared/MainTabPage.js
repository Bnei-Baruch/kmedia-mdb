import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Menu } from 'semantic-ui-react';

import NavLink from '../Language/MultiLanguageNavLink';
import SectionHeader from './SectionHeader';

const MainTabPage = ({ tabs, content, section }) => {
  const { t }  = useTranslation('common', { useSuspense: false });
  const params = useParams();

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
  section: PropTypes.string.isRequired,
};

export default MainTabPage;
