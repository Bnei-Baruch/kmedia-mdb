import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Image, Label } from 'semantic-ui-react';

import { assetUrl, imaginaryUrl, Requests } from '../../../helpers/Api';
import * as shapes from '../../shapes';
import Link from '../../Language/MultiLanguageLink';

const getRandomImage = () => {
  const rand = Math.floor(Math.random() * Math.floor(9)) + 1;
  let src    = assetUrl(`lessons/latest_lesson_${rand}.jpg`);
  if (!src.startsWith('http')) {
    src = `http://localhost${src}`;
  }
  return `${imaginaryUrl('resize')}?${Requests.makeParams({ url: src, width: 512, height:288 })}`;
};

class LatestDailyLesson extends Component {
  static propTypes = {
    collection: shapes.LessonCollection.isRequired,
    t: PropTypes.func.isRequired,
  };

  state = {
    imageSrc: getRandomImage(),
  };

  render() {
    const { t, collection } = this.props;
    const { imageSrc }      = this.state;

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
          <Label color="orange">
            {t('nav.sidebar.lessons')}
          </Label>
        </Link>
      </div>
    );
  }
}

export default LatestDailyLesson;
