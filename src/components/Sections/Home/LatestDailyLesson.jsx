'use client';
import React, { useEffect, useState } from 'react';
import { Header, Image } from 'semantic-ui-react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { Requests, cmsUrl } from '../../../helpers/Api';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../lib/redux/slices/homeSlice';
import { selectors as mdb } from '../../../../lib/redux/slices/mdbSlice';
import { isEmpty } from '../../../helpers/utils';

export const getRandomLatestLesson = (width = 512, height = 288) => {
  const params = { width, height, nocrop: false, stripmeta: true, };
  const rand   = Math.floor(Math.random() * Math.floor(31)) + 1;
  params.url   = cmsUrl(`images/lesson/latest_lesson_${rand}.jpg`);

  return Requests.imaginary('resize', params);
};

const LatestDailyLesson = () => {
  const { t } = useTranslation();

  const latestLessonID = useSelector(state => selectors.getLatestLesson(state.home) || []);
  const latestLesson   = useSelector(state => mdb.getCollectionById(state.mdb, latestLessonID));

  const [imageSrc, setImage] = useState();

  useEffect(() => setImage(getRandomLatestLesson()), []);

  return (
    <Link href="/lessons/daily/latest">
      <div className="thumbnail">
        {/*<Image fluid src={imageSrc} className="thumbnail__image" width={512} />*/}
        <Header as="h2" className="thumbnail__header">
          <Header.Content>
            <Header.Subheader>
              {latestLesson && t('values.date', { date: latestLesson.film_date })}
            </Header.Subheader>
            {t('home.last-lesson')}
          </Header.Content>
        </Header>
      </div>
    </Link>
  );
};

export default LatestDailyLesson;
