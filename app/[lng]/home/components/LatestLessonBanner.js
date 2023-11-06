import React from 'react';
import { fetchBanners } from '../../../api/home';
import SwitchLatestLessonBanner from './SwitchLatestLessonBanner';

const LatestLessonBanner = async () => {
  const banners = await fetchBanners();

  return <SwitchLatestLessonBanner bannes={banners} />;
};

export default LatestLessonBanner;
