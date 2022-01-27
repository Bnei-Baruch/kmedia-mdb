import React, { useState } from 'react';
import { Swipeable } from 'react-swipeable';
import { Button, Card } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import moment from 'moment';
import * as consts from '../../../helpers/consts';
import { withNamespaces } from 'react-i18next';
import LatestUpdate from './LatestUpdate';
import { getSectionForTranslation } from '../../../helpers/utils';
import Section from './Section';
import { isLanguageRtl } from '../../../helpers/i18n-utils';

const LatestUpdatesCardList = ({ t, language, title, cts, itemsByCT, itemsCount=4 }) => {

  const [pageNo, setPageNo] = useState(0);

  const [pageStart, setPageStart] = useState(0);

  const [cardsArray, setCardsArray] = useState([]);

  const onScrollRight = () => onScrollChange(pageNo + 1);

  const onScrollLeft = () => onScrollChange(pageNo - 1);

  const getLatestUpdate = item =>
    <LatestUpdate key={item.id} item={item} label={t(getSectionForTranslation(item.content_type))} t={t} />;

  const initCardsArray = () => {
    // arrange cards by type in criss cross order
    const cards = [];
    const items = {};

    const getEntryItems = entry => {
      if (!itemsByCT[entry.ct])
        return [];
      const entryItems = [...itemsByCT[entry.ct]];
      return entryItems;
      //return entry.daysBack ? entryItems.filter(item => moment().diff(moment(item.film_date), 'days') < entry.daysBack) : entryItems;
    }

    cts.forEach(entry => items[entry.ct] = getEntryItems(entry));
    let hasItems = true;
    while (hasItems) {
      hasItems = false;
      cts.forEach(ct => {
        const curItems = items[ct.ct];
        let count = ct.itemsPerPage ? ct.itemsPerPage : 1;
        while (curItems.length > 0 && count > 0) {
          cards.push((curItems.shift()));
          count--;
          hasItems = true;
        }
      });
    }

    ;
    setCardsArray(cards);
  };

  const getPageCardArray = () =>
    cardsArray.slice(pageStart, pageStart + itemsCount).map(item => getLatestUpdate(item));

  const onScrollChange = newPageNo => {
    const newPageStart = newPageNo * itemsCount;
    if (newPageNo < 0 || newPageStart >= cardsArray.length) {
      return;
    }

    setPageNo(newPageNo);
    setPageStart(newPageStart);
  };

  const getSwipeProps = () => {
    const isRTL = isLanguageRtl(language);
    return {
      onSwipedLeft: isRTL ? onScrollRight : onScrollLeft,
      onSwipedRight: isRTL ? onScrollLeft : onScrollRight
    };
  };


  const renderScrollRight = () => {
    const dir = isLanguageRtl(language) ? 'right' : 'left';
    return pageNo === 0 ? null : (
      <Button
        icon={`chevron ${dir}`}
        circular
        basic
        size="large"
        onClick={onScrollLeft}
        className="scroll_intents"
        style={{ [dir]: '-15px' }}
      />
    );
  };

  const renderScrollLeft = () => {
    const dir = isLanguageRtl(language) ? 'left' : 'right';
    return (pageNo+1) * itemsCount >= cardsArray.length ? null : (
      <Button
        icon={`chevron ${dir}`}
        circular
        basic
        size="large"
        onClick={onScrollRight}
        className="scroll_intents left"
        style={{ [dir]: '-15px' }}
      />
    );
  };

  if (cardsArray.length == 0)
    initCardsArray();

  return <>
    <div className="cardsTitle">
      {title}
    </div>
    <Swipeable swipeProps={getSwipeProps()} >
      <Card.Group className="latestUpdatesCardGroup" itemsPerRow={itemsCount} stackable>
        {getPageCardArray()}
        {renderScrollLeft()}
        {renderScrollRight()}
      </Card.Group>
    </Swipeable>
  </>;
}

LatestUpdatesCardList.propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.string,
  title: PropTypes.string,
  cts: PropTypes.array,
  itemsByCT: PropTypes.any
};

export default withNamespaces()(LatestUpdatesCardList);
