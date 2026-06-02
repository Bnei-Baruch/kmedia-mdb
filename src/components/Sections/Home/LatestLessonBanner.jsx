import React, { useState } from 'react';
import { useInterval } from '../../../helpers/timer';
import { useSelector } from 'react-redux';
import Promoted from './Promoted';
import { homeGetBannerSelector } from '../../../redux/selectors';

const SWITCH_BANNERS_TIMEOUT = 5 * 1000; // every 5 sec

const LatestLessonBanner = () => {

  const banners = useSelector(homeGetBannerSelector);

  const [idx, setIdx] = useState(0);

  const len = banners?.data.length;

  useInterval(() => {
    if (len > 0) {
      setIdx(() => (idx + 1) % len);
    }
  }, SWITCH_BANNERS_TIMEOUT);

  const banner = banners?.data[idx];

  if (!banner) return null;

  return <Promoted banner={banners.data[idx]}/>;
};

export default LatestLessonBanner;
