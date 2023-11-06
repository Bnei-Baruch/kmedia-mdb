'use client';
import React, { useState } from 'react';
import { useInterval } from '../../../../src/helpers/timer';
import Promoted from './Promoted';

const SWITCH_BANNERS_TIMEOUT = 5 * 1000; // every 5 sec

const SwitchLatestLessonBanner = ({ banners }) => {
  const [idx, setIdx] = useState(0);
  const len           = banners?.data.length;

  useInterval(() => {
    if (len > 0) {
      setIdx(() => (idx + 1) % len);
    }
  }, SWITCH_BANNERS_TIMEOUT);

  const banner = banners?.data[idx];

  if (!banner) return null;

  return <Promoted banner={banners.data[idx]} />;
};
export default SwitchLatestLessonBanner;
