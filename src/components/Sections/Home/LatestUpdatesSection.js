import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Container, Feed, Grid, Segment } from 'semantic-ui-react';
import { isEqual } from 'lodash';
import moment from 'moment';
import * as consts from '../../../helpers/consts';
import * as shapes from '../../shapes';
import Section from './Section';
import LatestUpdatesCardList from './LatestUpdatesCardList'

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

const LatestUpdatesSection = ({ latestItems = [], t, language }) => {
  const itemsByCT = itemsByContentType(latestItems);

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

  // const getLatestUpdate = item =>
  //   <LatestUpdate key={item.id} item={item} label={t(getSectionForTranslation(item.content_type))} t={t} />;

  //const getCard = (content_type, index = 0) => itemsByCT[content_type]?.length > index && getLatestUpdate(itemsByCT[content_type][index]);

  //const cards = getComplexCards(getCard);

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

  console.log(language);

  return (
    <div className="homepage__thumbnails homepage__section">
      <Container className="padded horizontally">
        <Section title={t('materials.recommended.new')} computer={13}>

          <Card.Group itemsPerRow={4} doubling className="homepage__section__cardGroup">
            <LatestUpdatesCardList t={t} language={language} title={t(`events.collection.playlist.lessons`)} itemsByCT={itemsByCT} cts={[
              { ct:consts.CT_DAILY_LESSON, itemsPerPage:2 },
              { ct:consts.CT_WOMEN_LESSON, daysBack: 14 },
              { ct:consts.CT_VIRTUAL_LESSON, daysBack: 14 },
              { ct:consts.CT_LESSONS_SERIES }]} />

            <LatestUpdatesCardList  t={t} title={t(`programs.header.text`)} itemsByCT={itemsByCT} cts={[
              { ct:consts.CT_VIDEO_PROGRAM_CHAPTER }]}  />

            <LatestUpdatesCardList  t={t} title={t(`programs.tabs.clips`)} itemsByCT={itemsByCT} cts={[
              { ct:consts.CT_CLIP }]} />

            <LatestUpdatesCardList  t={t} title={t(`publications.header.text`)} itemsByCT={itemsByCT} cts={[
              { ct:consts.CT_ARTICLE }]} />

            <LatestUpdatesCardList  t={t} title={t(`nav.sidebar.events`)} itemsByCT={itemsByCT} cts={[
              { ct:consts.CT_CONGRESS },
              { ct:consts.CT_FRIENDS_GATHERING },
              { ct:consts.CT_MEAL },
              { ct:consts.CT_HOLIDAY }]} />
          </Card.Group>
        </Section>
      </Container>
    </div>
  );
};

LatestUpdatesSection.propTypes = {
  latestUnits: PropTypes.arrayOf(shapes.ContentUnit),
  t: PropTypes.func.isRequired,
  language: PropTypes.string
};

const arePropsEqual = (prevProps, nextProps) => {
  const prevIds = prevProps.latestUnits?.map(unit => unit.id);
  const nextIds = nextProps.latestUnits?.map(unit => unit.id);
  return isEqual(prevIds, nextIds);
};

export default React.memo(LatestUpdatesSection, arePropsEqual);
