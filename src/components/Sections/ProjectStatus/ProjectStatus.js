import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Header, Segment } from 'semantic-ui-react';

import { selectors as settings } from '../../../redux/modules/settings';

class ProjectStatus extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired
  };

  render() {
    const { language } = this.props;

    switch (language) {
    case 'he':
      return (
        <Segment>
          <Header as="h1" content="מה חדש?" textAlign="center" />

          <Header as="h3" content="על מה עבדנו לאחרונה:" />
          <ul>
            <li>HD - סופסוף אפשר לראות את השיעורים והתכניות שלנו באיכות HD</li>
            <li>ספריה - אפשרות לחפש בתוכן עניינים לפי שם מאמר</li>
            <li>התאמה למנועי חיפוש - רגע לפני שאנחנו בגוגל אנחנו צריכים להתאים עצמנו אליו</li>
            <li>פידבק - הוספנו אפשרות לפידבק כדי לשמוע מכם מה אתם מציעים, תראו את האייקון הוורוד לחצו וכתבו לנו מה מפריע
              לכם, מה לא עובד ומה צריך לתקן.
            </li>
            <li>באגים - עבודה מתמשכת של באגים ותיקונים כדי שהכל יעבוד לכם כמו שצריך</li>
            <li>סידור וטיוב החומר - עבודה מתמשכת של סידור החומר, יש לא מעט ממנו שצריך לתאר, לתייג, לתרגם</li>
            <li>שפות נוספות לממשק - ספרדית, טורקית ואוקראינית</li>
          </ul>

          <Header as="h3" content="עוד רגע מוכן:" />
          <ul>
            <li>התאמה לרשתות חברתיות - תוכלו לשתף בפייסבוק ובשאר הרשתות בצורה קלה ונוחה</li>
            <li>גרסא 2 של הספריה - הוספת פיצרים חדשים הדרושים לקריאה נוחה של טקסט, שיפור במובייל, הוספת טקסטים באנגלית
              ובשפות נוספות, תיקונים של באגים
            </li>
            <li>שיפור מדור הרצאות ושיעורים - עובדים על לשפר אותו כדי שיהיה יותר נוח למצוא שיעורים והרצאות</li>
            <li>הוספת סדרות של שיעורים - יתווסף תת מדור נוסף שיכלול סדרות שיעורים מסודרות לפי הסדר ולפי מקור</li>
            <li>שיפור התנהגות פילטרים - כל הפילטרים באתר יותאמו למובייל</li>
            <li>גרסא 2 של החיפוש - חיפוש טוב יותר ונוח יותר למשתמש</li>
            <li>החלפת האתר הישן - הארכיון החדש יכנס לתפקוד מלא ויחליף את האתר הישן עד כנס ניו ג'רזי</li>
          </ul>
        </Segment>
      );

    default:
      return (
        <Segment>
          <Header as="h1" content="What's new?" textAlign="center" />

          <Header as="h3" content="What we've been working on lately:" />
          <ul>
            <li>HD - Finally, you can see our lessons and programs in HD</li>
            <li>Library - Option to search by article name in the table of contents</li>
            <li>Search Engine Optimization - Just before we go on Google, we need to adapt ourselves to it.</li>
            <li>feedback - we have added a feedback option to hear from you what you need, look for the pink icon click
              and write to us what bothers you, what does not work and what needs to be fixed.
            </li>
            <li>Bugs - ongoing bugs and fixes to make everything work for you</li>
            <li>Arrangement and improvement of the material - continuous work of arranging the material, there is quite
              a bit of it, that needs to be described, labeled, translated
            </li>
            <li>Additional languages ​​for the interface - Spanish, Turkish and Ukrainian</li>
          </ul>

          <Header as="h3" content="Ready soon:" />
          <ul>
            <li>Fit to social networks - You can share Facebook and other networks easily</li>
            <li>Version 2 of the library - adding new tools needed for easy text reading, mobile enhancement, adding
              English and other languages texts, bug fixes
            </li>
            <li>Improving lectures and lessons section - working on improving it so that it is more convenient to find
              classes and lectures
            </li>
            <li>Series of lessons - additional sub-sections will be added that will include ordered series of lessons
              gathered by source or topics.
            </li>
            <li>Improved filters behavior - All filters on the site will be adapted to mobile</li>
            <li>Version 2 of the search - a better and more convenient search</li>
            <li>Replacing the old site - the new archive will be fully functional and will replace the old site until
              the New Jersey conference
            </li>
          </ul>
        </Segment>
      );
    }
  }
}

const mapState = state => ({
  language: settings.getLanguage(state.settings),
});

export default connect(mapState)(translate()(ProjectStatus));
