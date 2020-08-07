import React from 'react';
import PropTypes from 'prop-types';
import { Card, Container } from 'semantic-ui-react';
import { getSectionForTranslation } from '../../../helpers/utils';
import * as consts from '../../../helpers/consts';
import * as shapes from '../../shapes';
import Section from './Section';
import LatestUpdate from './LatestUpdate';
import { isEqual } from 'lodash';

const unitsByContentType = list =>
  list.reduce((acc, val) => {
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

const LatestUpdatesSection = ({ latestUnits = [], t }) => {
  const unitsByCT = unitsByContentType(latestUnits);

  const getCardArray = (content_type, itemsCount) =>
    unitsByCT[content_type]?.slice(0, itemsCount).map(unit => getLatestUpdate(unit));

  const getCard = (content_type, index = 0) =>
    unitsByCT[content_type]?.length > index && getLatestUpdate(unitsByCT[content_type][index]);

  const getLatestUpdate = unit =>
    <LatestUpdate key={unit.id} unit={unit} label={t(getSectionForTranslation(unit.content_type))} t={t}/>;

  const eventTypes = [consts.CT_CONGRESS, consts.CT_FRIENDS_GATHERING, consts.CT_MEAL, consts.CT_HOLIDAY];

  return (
    <div className="homepage__thumbnails homepage__section">
      <Container className="padded horizontally">
        <Section title={t('home.updates')}>
          <Card.Group itemsPerRow={4} doubling>
            {getCard(consts.CT_LESSON_PART)}
            {getCard(consts.CT_LESSON_PART, 1)}
            {getCard(consts.CT_WOMEN_LESSON) || getCard(consts.CT_LESSON_PART, 2)}
            {getCard(consts.CT_VIRTUAL_LESSON)}
            {getCardArray(consts.CT_VIDEO_PROGRAM_CHAPTER, 4)}
            {getCardArray(consts.CT_CLIP, 4)}
            {getCardArray(consts.CT_ARTICLE, 4)}
            {eventTypes.map(type => getCard(type))}
          </Card.Group>
        </Section>
      </Container>
    </div>
  );
};

LatestUpdatesSection.propTypes = {
  latestUnits: PropTypes.arrayOf(shapes.ContentUnit),
  t: PropTypes.func.isRequired
};

const arePropsEqual = (prevProps, nextProps) => {
  const prevIds = prevProps.latestUnits?.map(unit => unit.id);
  const nextIds = nextProps.latestUnits?.map(unit => unit.id);
  return isEqual(prevIds, nextIds);
};

export default React.memo(LatestUpdatesSection, arePropsEqual);
