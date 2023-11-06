import React from 'react';
import moment from 'moment';
import { Container } from '/lib/SUI';

import * as consts from '../../../../src/helpers/consts';
import Section from './Section';
import LatestUpdatesCardList from './LatestUpdatesCardList';
import { useTranslation } from '../../../i18n';
import { fetchHome } from '../../../api/home';
import { useCookies } from 'react-cookie';
import { cookies } from 'next/headers';

const itemsByContentType = list => list.filter(x => !!x).reduce((acc, val) => {
  if (!acc[val.content_type]) {
    acc[val.content_type] = [val];
  } else {
    // sort by film_date descending
    let i = 0;
    while (i < acc[val.content_type].length) {
      if (acc[val.content_type][i].film_date > val.film_date) {
        i++;
      } else {
        break;
      }
    }

    acc[val.content_type].splice(i, 0, val);
  }

  return acc;
}, {});

const COLLECTION_CTS       = [
  { ct: consts.CT_DAILY_LESSON, itemsPerPage: 2 },
  { ct: consts.CT_WOMEN_LESSON, daysBack: 30 },
  { ct: consts.CT_VIRTUAL_LESSON, daysBack: 30 },
  { ct: consts.CT_LESSONS_SERIES }
];
const PROGRAMM_CTS         = [
  { ct: consts.CT_VIDEO_PROGRAM_CHAPTER }
];
const LatestUpdatesSection = async ({ lng }) => {
  const { isMobileDevice } = false;//useContext(DeviceInfoContext);
  const { t }              = await useTranslation(lng);

  const cookieStore = cookies();
  const clng        = cookieStore.get('clng')?.value.split(',');

  const { latest_daily_lesson: latestDaily, latest_cos: latestCos, latest_units: latestUnits } = await fetchHome({
    ui_language: lng,
    content_languages: clng
  });

  const itemsByCT = itemsByContentType([...latestUnits, latestDaily, ...latestCos]);

  if (itemsByCT[consts.CT_DAILY_LESSON]) {
    itemsByCT[consts.CT_DAILY_LESSON] = itemsByCT[consts.CT_DAILY_LESSON].sort(
      (a, b) => {
        if (a.film_date !== b.film_date) {
          return moment(a).diff(moment(b), 'days');
        }

        return a.number - b.number;
      },
    );
  }

  // row #1:
  //    a. lesson collection before the last lesson CT_DAILY_LESSON - 1
  //    b. lesson collection before the collection in a CT_DAILY_LESSON - 2
  //    c + d. switch by created at between:
  //      women lesson unit CT_WOMEN_LESSON,
  //      virtual lesson unit CT_VIRTUAL_LESSON,
  //      lessons_series collection CT_LESSONS_SERIES, if one of them is older than 2 weeks use another lesson collection
  // row #2: CT_VIDEO_PROGRAM_CHAPTER x 4
  // row #3: CT_CLIP x 4
  // row #4: CT_ARTICLE x 4
  // row #5: CT_CONGRESS, CT_FRIENDS_GATHERING, CT_FRIENDS_GATHERING, CT_MEAL

  const itemsPerRow = isMobileDevice ? 1 : 4;

  return (
    <div className="homepage__thumbnails homepage__section">
      <Container className="padded horizontally">
        <Section
          title={t('home.latest-updates.new-on-the-site')}
          className={'latestUpdateSection'}
          computer={13}>
          <div className="homepage__section__latestUpdates">
            <LatestUpdatesCardList
              title={t(`events.collection.playlist.lessons`)}
              itemsByCT={itemsByCT}
              maxItems={20}
              itemsPerRow={itemsPerRow}
              stackable={!isMobileDevice}
              cts={COLLECTION_CTS}
              lng={lng}
            />

            <LatestUpdatesCardList
              title={t(`programs.header.text`)}
              itemsByCT={itemsByCT}
              maxItems={20}
              itemsPerRow={itemsPerRow}
              stackable={!isMobileDevice}
              cts={PROGRAMM_CTS}
              lng={lng}
            />

            <LatestUpdatesCardList
              title={t(`programs.tabs.clips`)}
              itemsByCT={itemsByCT}
              maxItems={20}
              itemsPerRow={itemsPerRow}
              stackable={!isMobileDevice}
              cts={[{ ct: consts.CT_CLIP }]}
              lng={lng}
            />

            <LatestUpdatesCardList
              title={t(`publications.header.text`)}
              itemsByCT={itemsByCT}
              maxItems={20}
              itemsPerRow={itemsPerRow}
              stackable={!isMobileDevice}
              cts={[{ ct: consts.CT_ARTICLE }]}
              lng={lng}
            />

            <LatestUpdatesCardList
              title={t(`nav.sidebar.events`)}
              itemsByCT={itemsByCT}
              maxItems={20}
              itemsPerRow={itemsPerRow}
              stackable={!isMobileDevice}
              cts={[
                { ct: consts.CT_CONGRESS },
                { ct: consts.CT_FRIENDS_GATHERING },
                { ct: consts.CT_MEAL },
                { ct: consts.CT_HOLIDAY }]}
              lng={lng}
            />
          </div>
        </Section>
      </Container>
    </div>
  );
};

export default LatestUpdatesSection;
