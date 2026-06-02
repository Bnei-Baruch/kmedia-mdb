import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import NavLink from '../Language/MultiLanguageNavLink';
import SectionHeader from './SectionHeader';

const MainTabPage = ({ tabs, content, section }) => {
  const { t } = useTranslation();
  const params = useParams();

  const tab = params.tab || tabs[0];

  const submenuItems = tabs.map(x => (
    <NavLink
      key={x}
      to={`/${section}/${x}`}
      className={`px-4 py-2 ${tab === x ? 'font-bold border-b-2 border-blue-500' : 'text-gray-600 hover:text-gray-900'}`}
    >
      {t(`${section}.tabs.${x}`)}
    </NavLink>
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
