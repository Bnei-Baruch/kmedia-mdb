import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Requests, cmsUrl } from '../../../helpers/Api';
import Link from '../../Language/MultiLanguageLink';
import * as shapes from '../../shapes';

export const getRandomLatestLesson = (width = 512, height = 288) => {
  const params = { width, height, nocrop: false, stripmeta: true };
  const rand = Math.floor(Math.random() * Math.floor(31)) + 1;
  params.url = cmsUrl(`images/lesson/latest_lesson_${rand}.jpg`);

  return Requests.imaginary('resize', params);
};

const LatestDailyLesson = ({ collection }) => {
  const { t } = useTranslation();
  const [imageSrc, setImage] = useState();

  useEffect(() => setImage(getRandomLatestLesson()), []);

  return (
    <div className="thumbnail">
      <Link to="/lessons/daily/latest">
        <img src={imageSrc} className="thumbnail__image w-full h-auto" width={512} alt="" />
        <h2 className="thumbnail__header">
          <div className="content">
            <div className="sub">{t('values.date', { date: collection.film_date })}</div>
            {t('home.last-lesson')}
          </div>
        </h2>
      </Link>
    </div>
  );
};

LatestDailyLesson.propTypes = {
  collection: shapes.LessonCollection.isRequired,
};

export default LatestDailyLesson;
