import PropTypes from 'prop-types';
import { clsx } from 'clsx';
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
      className={clsx(
        // Semantic "tabular menu" item
        'px-[24.3px] py-[15.8px] leading-none border border-b-0 rounded-t-[4px] -mb-px',
        tab === x ? 'bg-white font-bold text-black/95! border-[#d4d4d5]' : 'border-transparent text-black/87! hover:text-black/95!'
      )}
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
