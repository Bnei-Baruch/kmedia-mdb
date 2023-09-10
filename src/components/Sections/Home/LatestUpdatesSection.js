import React, { useContext, useMemo } from 'react';
import moment from 'moment';
import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';

import * as consts from '../../../helpers/consts';
import * as shapes from '../../shapes';
import Section from './Section';
import LatestUpdatesCardList from './LatestUpdatesCardList';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { useTranslation } from 'next-i18next';
import { useSelector, shallowEqual } from 'react-redux';
import { selectors } from '../../../../lib/redux/slices/homeSlice';
import { selectors as mdb } from '../../../../lib/redux/slices/mdbSlice';

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
const LatestUpdatesSection = () => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const { t }              = useTranslation();

  const latestUnitIDs = useSelector(state => selectors.getLatestUnits(state.home) || [], shallowEqual);
  const latestUnits   = useSelector(state => latestUnitIDs.map(x => mdb.getDenormContentUnit(state.mdb, x)));
  const latestCoIDs   = useSelector(state => selectors.getLatestCos(state.home) || [], shallowEqual);
  const latestCos     = useSelector(state => latestCoIDs.map(x => mdb.getDenormCollection(state.mdb, x)));

  const itemsByCT = useMemo(() => {
    return itemsByContentType([...latestUnits, ...latestCos]);
  }, [latestUnits.length, latestCos.length]);

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
            />

            <LatestUpdatesCardList
              title={t(`programs.header.text`)}
              itemsByCT={itemsByCT}
              maxItems={20}
              itemsPerRow={itemsPerRow}
              stackable={!isMobileDevice}
              cts={PROGRAMM_CTS}
            />

            <LatestUpdatesCardList
              title={t(`programs.tabs.clips`)}
              itemsByCT={itemsByCT}
              maxItems={20}
              itemsPerRow={itemsPerRow}
              stackable={!isMobileDevice}
              cts={[
                { ct: consts.CT_CLIP }]}
            />

            <LatestUpdatesCardList
              title={t(`publications.header.text`)}
              itemsByCT={itemsByCT}
              maxItems={20}
              itemsPerRow={itemsPerRow}
              stackable={!isMobileDevice}
              cts={[
                { ct: consts.CT_ARTICLE }]}
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
            />
          </div>
        </Section>
      </Container>
    </div>
  );
};

export default LatestUpdatesSection;
