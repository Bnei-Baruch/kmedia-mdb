import React from 'react';

import { useTranslation } from 'react-i18next';
import TopMostHelmet from '../shared/Helmets/TopMost';

const TopMost = () => {
  const { t } = useTranslation();

  return (
    <TopMostHelmet
      titlePostfix={t('nav.top.header')}
    />
  );
};

export default TopMost;
