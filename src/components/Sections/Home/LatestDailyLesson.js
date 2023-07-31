import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Header, Image } from 'semantic-ui-react';
import { withTranslation } from 'react-i18next';
import * as shapes from '../../shapes';
import Link from '../../Language/MultiLanguageLink';
import { Requests, cmsUrl } from '../../../helpers/Api';

export const getRandomLatestLesson = (width = 512, height = 288) => {
  const params = { width, height, nocrop: false, stripmeta: true, };
  const rand   = Math.floor(Math.random() * Math.floor(31)) + 1;
  params.url   = cmsUrl(`images/lesson/latest_lesson_${rand}.jpg`);

  return Requests.imaginary('resize', params);
};

const LatestDailyLesson = ({ collection, t }) => {
  const [imageSrc, setImage] = useState();

  useEffect(() => setImage(getRandomLatestLesson()), []);

  return (
    <div className="thumbnail">
      <Link to="/lessons/daily/latest">
        <Image fluid src={imageSrc} className="thumbnail__image" width={512} />
        <Header as="h2" className="thumbnail__header">
          <Header.Content>
            <Header.Subheader>
              {t('values.date', { date: collection.film_date })}
            </Header.Subheader>
            {t('home.last-lesson')}
          </Header.Content>
        </Header>
      </Link>
    </div>
  );
};

LatestDailyLesson.propTypes = {
  collection: shapes.LessonCollection.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(LatestDailyLesson);
