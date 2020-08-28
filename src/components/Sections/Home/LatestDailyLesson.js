import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Header, Image } from 'semantic-ui-react';
import { withNamespaces } from 'react-i18next';
import * as shapes from '../../shapes';
import Link from '../../Language/MultiLanguageLink';
import { Requests } from '../../../helpers/Api';

const getRandomImage = () => (
  Requests.imaginaryRandom('resize', {
    width: 512,
    height: 288,
    nocrop: false,
    stripmeta: true,
  }, `lessons/latest_lesson_%s.jpg`)
);

const LatestDailyLesson = ({ collection, t }) => {
  const [imageSrc, setImage] = useState();

  useEffect(() => setImage(getRandomImage()), []);

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

export default withNamespaces()(LatestDailyLesson);
