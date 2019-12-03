import React from 'react';
import { useSelector } from 'react-redux';
import { Card, Container, Divider, Grid } from 'semantic-ui-react';

import { LANG_ENGLISH, LANG_HEBREW, LANG_RUSSIAN } from '../../../helpers/consts';
import { assetUrl } from '../../../helpers/Api';
import { selectors as settings } from '../../../redux/modules/settings';
import SectionHeader from '../../shared/SectionHeader';

const clips = ['1', '2', '3', '4-1', '4-2', '5', '6', '7'];

const texts = [
  {
    title: {
      [LANG_HEBREW]: 'דף הבית',
      [LANG_ENGLISH]: 'Homepage',
      [LANG_RUSSIAN]: 'Главная страница',
    },
    description: {
      [LANG_HEBREW]: 'הסבר כללי על מבנה דף הבית, מה יש בו וכיצד אפשר לנווט ממנו למדורים השונים באתר.',
      [LANG_ENGLISH]: 'General explanation about the structure of the home page, what it contains and how can we navigate to the various sections of the site from the home page.',
      [LANG_RUSSIAN]: 'Общее описание структуры домашней страницы, что она содержит, и как мы можем перемещаться по различным разделам сайта с домашней страницы.',
    },
  },
  {
    title: {
      [LANG_HEBREW]: 'שיעור הקבלה היומי',
      [LANG_ENGLISH]: 'The Latest Daily Lesson',
      [LANG_RUSSIAN]: 'Последний Урок',
    },
    description: {
      [LANG_HEBREW]: 'איך מוצאים את השיעור האחרון, מה כולל הדף של השיעור ואיך משתמשים בו.',
      [LANG_ENGLISH]: 'How to find the last lesson, what includes the page of the lesson and how to use it.',
      [LANG_RUSSIAN]: 'Как найти последний урок, что есть на страницы урока и как ей пользоваться',
    },
  },
  {
    title: {
      [LANG_HEBREW]: 'שיעורים והרצאות',
      [LANG_ENGLISH]: 'Lessons & Lectures',
      [LANG_RUSSIAN]: 'Уроки и Лекции',
    },
    description: {
      [LANG_HEBREW]: 'שיעור יומי, שיעור וירטואלי, הרצאות, שיעורי נשים, הכל במקום אחד. איך מסודרים השיעורים ואיך למצוא מה שמחפשים בקלות.',
      [LANG_ENGLISH]: 'Daily lessons, virtual lessons, lectures, women\'s lessons, all in one place. How the lessons are organized and how to find what we are looking for easily.',
      [LANG_RUSSIAN]: 'Ежедневные уроки, виртуальные уроки, лекции, женские уроки, все в одном месте. Как организованы уроки и как легко найти то, что мы ищем.',
    },
  },
  {
    title: {
      [LANG_HEBREW]: 'תוכניות וקליפים',
      [LANG_ENGLISH]: 'Programs & Clips',
      [LANG_RUSSIAN]: 'Программы и Клипы',
    },
    description: {
      [LANG_HEBREW]: 'איזה תוכניות יש, איך הן מחולקות ואיך להתמצא במדור.',
      [LANG_ENGLISH]: 'What programs are there, how they are divided, and how to navigate in the section.',
      [LANG_RUSSIAN]: 'Какие программы существуют, как они разделены и как ориентироваться в разделе.',
    },
  },
  {
    title: {
      [LANG_HEBREW]: 'איך לחפש תוכנית',
      [LANG_ENGLISH]: 'How to search for a program',
      [LANG_RUSSIAN]: 'Как искать программу',
    },
    description: {
      [LANG_HEBREW]: 'איך למצוא את התוכנית האהובה עליי. אם יש נושא שמעניין אותי אבל אני לא יודע איזה תוכניות עסקו בנושא, איך עליי לחפש.',
      [LANG_ENGLISH]: 'How to find my favorite program. If there is a subject that interests me, but I do not know what programs were on the subject, how should I search.',
      [LANG_RUSSIAN]: 'Как найти мою любимую программу. Если есть вопрос, который меня интересует, но я не знаю, какие программы были на эту тему, как мне лудше искать искать.',
    },
  },
  {
    title: {
      [LANG_HEBREW]: 'ספריית המקורות',
      [LANG_ENGLISH]: 'Library',
      [LANG_RUSSIAN]: 'Библиотека',
    },
    description: {
      [LANG_HEBREW]: 'מה כוללת הספרייה, איזה כתבי מקובלים יש, איך להגיע למאמר שאני מחפש.',
      [LANG_ENGLISH]: 'What the library includes, which Kabbalistic writings there are, and how to get to the article I am looking for.',
      [LANG_RUSSIAN]: 'Как построена библиотека, какие Каббалистические источники в ней есть и как найти статью которую я ищу.',
    },
  },
  {
    title: {
      [LANG_HEBREW]: 'כנסים ואירועים',
      [LANG_ENGLISH]: 'Conventions & Events',
      [LANG_RUSSIAN]: 'Конгрессы, события',
    },
    description: {
      [LANG_HEBREW]: 'כנסים בארץ ובעולם, חגים ומועדים, ישיבות החברים, הסעודות וערבי האיחוד. איך למצוא את הכנס הבלתי נשכח בחיי.',
      [LANG_ENGLISH]: 'Conferences in Israel and around the world, Holidays, Friends Gatherings, Meals and Unity Days. How to find the most unforgettable conference in my life.',
      [LANG_RUSSIAN]: 'Конгрессы в Израиле и по всему миру , праздники, Собрания Товарищей, Трапезы и Дни Единства. Как найти незабываемый конгресс моей жизни.',
    },
  },
  {
    title: {
      [LANG_HEBREW]: 'חיפוש',
      [LANG_ENGLISH]: 'Search',
      [LANG_RUSSIAN]: 'Поиск',
    },
    description: {
      [LANG_HEBREW]: 'באתר קבלה מדיה יש המון תוכן, איך להגיע למה שאנו צריכים בדרך הכי קצרה ופשוטה.',
      [LANG_ENGLISH]: 'The Kabbalah Media site has loads of content, how to get what we need in the shortest and simplest way.',
      [LANG_RUSSIAN]: 'На сайте «Каббала Медиа» есть множество материалов, как получить то, что нам нужно самым коротким и простым способом.',
    },
  },
];

const HelpPage = () => {
  let language = useSelector(state => settings.getLanguage(state.settings));

  switch (language) {
  case LANG_HEBREW:
    language = LANG_HEBREW;
    break;
    // case LANG_UKRAINIAN:
  case LANG_RUSSIAN:
    language = LANG_RUSSIAN;
    break;
  default:
    language = LANG_ENGLISH;
    break;
  }

  let c    = clips;
  let txts = texts;
  if (language !== LANG_HEBREW) {
    c = [...clips];
    c.splice(4, 1); // remove 4-2 in other langs
    txts = [...texts];
    txts.splice(4, 1); // remove 4-2 in other langs
  }

  return (
    <div>
      <SectionHeader section="help" />
      <Divider hidden />
      <Container>
        <Grid stackable columns={3}>
          {
            c.map((x, i) => (
              <Grid.Column key={x}>
                <Card fluid>
                  <Card.Content>
                    <Card.Header>{txts[i].title[language]}</Card.Header>
                  </Card.Content>
                  <Card.Content>
                    <div>
                      <video
                        controls
                        playsInline
                        preload="metadata"
                        type="video/mp4"
                        src={assetUrl(`help/${language}/clip${x}.mp4`)}
                        poster={assetUrl(`help/${language}/clip${x}.jpg`)}
                        style={{ width: '100%', height: 'auto' }}
                      />
                    </div>
                  </Card.Content>
                  <Card.Content>
                    {txts[i].description[language]}
                  </Card.Content>
                </Card>
              </Grid.Column>
            ))
          }
        </Grid>
      </Container>
      <Divider hidden />
    </div>
  );
};

export default HelpPage;
