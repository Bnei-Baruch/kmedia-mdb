import React, { useContext, useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Button, Card } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { withTranslation } from 'react-i18next';
import LatestUpdate from './LatestUpdate';
import { getSectionForTranslation } from '../../../helpers/utils';
import clsx from 'clsx';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { useSelector } from 'react-redux';
import { settingsGetUIDirSelector, settingsGetLeftRightByDirSelector } from '../../../redux/selectors';

const LatestUpdatesCardList = (
  {
    t,
    title,
    maxItems,
    cts,
    itemsByCT,
    itemsPerRow = 4,
    itemsCount = 4,
    stackable = true
  }
) => {
  const { isMobileDevice }          = useContext(DeviceInfoContext);
  const [pageNo, setPageNo]         = useState(0);
  const [pageStart, setPageStart]   = useState(0);
  const [cardsArray, setCardsArray] = useState([]);
  const uiDir                       = useSelector(settingsGetUIDirSelector);
  const leftRight                   = useSelector(settingsGetLeftRightByDirSelector);

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
      //return entryItems;
      return entry.daysBack ? entryItems.filter(item => moment().diff(moment(item.film_date), 'days') < entry.daysBack) : entryItems;
    };

    cts.forEach(entry => items[entry.ct] = getEntryItems(entry));
    let hasItems = true;
    while (hasItems && cards.length < maxItems) {
      hasItems = false;
      cts.forEach(ct => {
        const curItems = items[ct.ct];
        let count      = ct.itemsPerPage ? ct.itemsPerPage : 1;
        while (curItems.length > 0 && count > 0) {
          cards.push((curItems.shift()));
          count--;
          hasItems = true;
        }
      });
    }

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

  const swipeHandlers = useSwipeable({
    onSwipedLeft: uiDir === 'rtl' ? onScrollRight : onScrollLeft,
    onSwipedRight: uiDir === 'rtl' ? onScrollLeft : onScrollRight
  });

  const renderScrollRight = () => {
    const dir = uiDir === 'rtl' ? 'right' : 'left';
    return pageNo === 0 ? null : (
      <Button
        icon={`chevron ${dir}`}
        basic
        size="large"
        onClick={onScrollLeft}
        className="scroll_intents"
        style={{ [dir]: '-40px' }}
      />
    );
  };

  const renderScrollLeft = () => (pageNo + 1) * itemsCount >= cardsArray.length ? null : (
    <Button
      icon={`chevron ${leftRight}`}
      basic
      size="large"
      onClick={onScrollRight}
      className="scroll_intents left"
      style={{ [leftRight]: '-45px' }}
    />
  );

  useEffect(() => {
    initCardsArray();
  }, [cts]);

  const cardsRow = (
    <Card.Group className={clsx({
      'latestUpdatesCardGroup': !isMobileDevice,
      'latestUpdatesCardGroupMobile': isMobileDevice
    })} itemsPerRow={itemsPerRow} stackable={stackable}>
      {getPageCardArray()}
      {!isMobileDevice && renderScrollLeft()}
      {!isMobileDevice && renderScrollRight()}
    </Card.Group>
  );

  const swipCards = !isMobileDevice ?
    (
      <div {...swipeHandlers}>
        {cardsRow}
      </div>
    )
    : cardsRow;

  return <>
    <div className="cardsTitle">
      {title}
    </div>
    {swipCards}
  </>;
};

LatestUpdatesCardList.propTypes = {
  t: PropTypes.func.isRequired,
  title: PropTypes.string,
  cts: PropTypes.array,
  itemsByCT: PropTypes.any
};

export default withTranslation()(LatestUpdatesCardList);
