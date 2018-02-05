import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Header, Label, Image } from 'semantic-ui-react';
import Link from '../../Language/MultiLanguageLink';
import * as shapes from '../../shapes';
import { canonicalLink } from '../../../helpers/utils';
import DailyLessonPlaceholder from '../../../images/hp_lesson_temp.png';


class LatestDailyLesson extends Component {

  static propTypes = {
    unit: shapes.ContentUnit.isRequired,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {};

  render() {
    const { t, unit } = this.props;

    return (
      <div className="thumbnail">
        <Link to={canonicalLink(unit)}>
          <Image className="thumbnail__image" src={DailyLessonPlaceholder} width={512} fluid />
          <Header className="thumbnail__header">
            <Header.Content>
              <Header.Subheader>
                {t('values.date', { date: new Date(unit.film_date) })}
              </Header.Subheader>
              {t('homePage.latestDailyLesson.title')}
            </Header.Content>
          </Header>
          <Label color="orange" size="mini">
            {t('nav.sidebar.lessons')}
          </Label>
        </Link>
      </div>
    );
  }
}

export default translate()(LatestDailyLesson);
