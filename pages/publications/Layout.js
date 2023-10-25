import React from 'react';
import { useTranslation } from 'next-i18next';
import { Menu } from 'semantic-ui-react';
import NavLink from '../../src/components/Language/MultiLanguageNavLink';
import SectionHeader from '../../src/components/shared/SectionHeader';

export const tabs = [
  'blog',
  'twitter',
  'articles',
  'audio-blog'
];

const PublicationsLayout = ({ namespace, children }) => {
  const { t } = useTranslation();

  const submenuItems = tabs.map(x => (
    <Menu.Item
      key={x}
      name={x}
      as={NavLink}
      href={`/publications/${x}`}
      active={namespace === x}
    >
      {t(`publications.tabs.${x}`)}
    </Menu.Item>
  ));

  return (
    <div>
      <SectionHeader section={'publications'} submenuItems={submenuItems} />
      {children}
    </div>
  );
};

export default PublicationsLayout;
