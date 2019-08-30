import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Header, Image } from 'semantic-ui-react';
import { withNamespaces } from 'react-i18next';

import { assetUrl, imaginaryUrl, Requests } from '../../../helpers/Api';
import Link from '../../Language/MultiLanguageLink';

const getRandomImage = () => {
  const rand = Math.floor(Math.random() * Math.floor(9)) + 1;
  let src    = assetUrl(`lessons/latest_lesson_${rand}.jpg`);
  if (!src.startsWith('http')) {
    src = `http://localhost${src}`;
  }
  const params = Requests.makeParams({
    url: src,
    width: 512,
    height: 288,
    nocrop: false,
    stripmeta: true,
  });
  return `${imaginaryUrl('resize')}?${params}`;
};

const LatestDailyLesson = ({ t, film_date }) => {
  const [imageSrc] = useState(getRandomImage());

  return (
    <div className="thumbnail">
      <Link to="/lessons/daily/latest">
        <Image fluid src={imageSrc} className="thumbnail__image" width={512} />
        <Header as="h2" className="thumbnail__header">
          <Header.Content>
            <Header.Subheader>
              {t('values.date', { date: film_date })}
            </Header.Subheader>
            {t('home.last-lesson')}
          </Header.Content>
        </Header>
      </Link>
    </div>
  );
};

LatestDailyLesson.propTypes = {
  film_date: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(LatestDailyLesson);
