import React from 'react';
import { Header, Image, HeaderSubheader, HeaderContent } from '/lib/SUI';
import Link from 'next/link';
import { fetchHome } from '../../../api/home';
import { useTranslation } from '../../../i18n';
import { imaginary } from '../../../api/imaginary';
import { cmsUrl } from '../../../api/constants';

export const getRandomLatestLesson = (width = 512, height = 288) => {
  const params = { width, height, nocrop: false, stripmeta: true, };
  const rand   = Math.floor(Math.random() * Math.floor(31)) + 1;
  params.url   = cmsUrl(`images/lesson/latest_lesson_${rand}.jpg`);

  return imaginary('resize', params);
};

const LatestDailyLesson = async ({ params: { lng } }) => {
  const { t } = useTranslation(lng);

  const { latest_daily_lesson: latestLesson } = await fetchHome({
    ui_language: lng,
    content_languages: ['ru', 'he']
  });

  const imageSrc = getRandomLatestLesson();

  return (
    <Link href="/lessons/daily/latest">
      <div className="thumbnail">
        <Image fluid src={imageSrc} className="thumbnail__image" width={512} />
        <Header as="h2" className="thumbnail__header">
          <HeaderContent>
            <HeaderSubheader>
              {latestLesson && t('values.date', { date: latestLesson.film_date })}
            </HeaderSubheader>
            {t('home.last-lesson')}
          </HeaderContent>
        </Header>
      </div>
    </Link>
  );
};

export default LatestDailyLesson;
