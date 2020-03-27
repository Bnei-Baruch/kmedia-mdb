import React from 'react';
import PropTypes from 'prop-types';
import { Header, Image } from 'semantic-ui-react';
import { withNamespaces } from 'react-i18next';

import { assetUrl, Requests } from '../../../helpers/Api';
import * as shapes from '../../shapes';
import Link from '../../Language/MultiLanguageLink';

const getRandomImage = () => {
  const rand = Math.floor(Math.random() * Math.floor(9)) + 1;

  return Requests.imaginary('resize', {
    url: assetUrl(`lessons/latest_lesson_${rand}.jpg`),
    width: 512,
    height: 288,
    nocrop: false,
    stripmeta: true,
  });
};

const LatestDailyLesson = ({ collection, t }) => {
  const imageSrc = getRandomImage();

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
        {/* <Label color="black" size="tiny">
            {t('nav.sidebar.lessons')}
          </Label> */}
      </Link>
    </div>
  );
}

LatestDailyLesson.propTypes = {
  collection: shapes.LessonCollection.isRequired,
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(LatestDailyLesson);
