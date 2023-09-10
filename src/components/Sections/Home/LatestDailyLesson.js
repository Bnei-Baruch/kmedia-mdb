import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Header, Image, Grid } from 'semantic-ui-react';
import { useTranslation } from 'next-i18next';
import * as shapes from '../../shapes';
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

  if (isEmpty(latestLesson)) return;

  return (
    <Grid.Column computer={6} tablet={7} mobile={16}>
      <div className="thumbnail">
        <Link href="/lessons/daily/latest">
          <>
            <Image fluid src={imageSrc} className="thumbnail__image" width={512} />
            <Header as="h2" className="thumbnail__header">
              <Header.Content>
                <Header.Subheader>
                  {t('values.date', { date: latestLesson.film_date })}
                </Header.Subheader>
                {t('home.last-lesson')}
              </Header.Content>
            </Header>
          </>
        </Link>
      </div>
    </Grid.Column>
  );
};

LatestDailyLesson.propTypes = {
  collection: shapes.LessonCollection.isRequired,
  t: PropTypes.func.isRequired,
};

export default LatestDailyLesson;
