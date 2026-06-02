import React from 'react';
import * as shapes from '../../shapes';
import LatestDailyLesson from './LatestDailyLesson';
import LatestLessonBanner from './LatestLessonBanner';

const HomeBanners = ({ latestLesson = null }) => (
  <div className="homepage__featured homepage__section">
    <div className=" px-4 flex flex-wrap justify-between">
      <div className="flex flex-wrap justify-between w-full">
        {
          latestLesson
            && <div className="w-[49%]">
              <LatestDailyLesson collection={latestLesson} />
            </div>
        }
        <div className="w-[49%]">
          <LatestLessonBanner />
        </div>
      </div>
    </div>
  </div>
);

HomeBanners.propTypes = { latestLesson: shapes.LessonCollection };

export default HomeBanners;
