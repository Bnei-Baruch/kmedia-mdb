import { clsx } from 'clsx';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useSwipeable } from 'react-swipeable';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { getSectionForTranslation } from '../../../helpers/utils';
import { settingsGetLeftRightByDirSelector, settingsGetUIDirSelector } from '../../../redux/selectors';
import LatestUpdate from './LatestUpdate';

const LatestUpdatesCardList = ({ title, maxItems, cts, itemsByCT, itemsCount = 4 }) => {
  const { t } = useTranslation();
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const [pageNo, setPageNo] = useState(0);
  const [pageStart, setPageStart] = useState(0);
  const [cardsArray, setCardsArray] = useState([]);
  const uiDir = useSelector(settingsGetUIDirSelector);
  const leftRight = useSelector(settingsGetLeftRightByDirSelector);

  const onScrollRight = () => onScrollChange(pageNo + 1);

  const onScrollLeft = () => onScrollChange(pageNo - 1);

  const getLatestUpdate = item => (
    <LatestUpdate key={item.id} item={item} label={t(getSectionForTranslation(item.content_type))} t={t} />
  );

  const initCardsArray = () => {
    const cards = [];
    const items = {};

    const getEntryItems = entry => {
      if (!itemsByCT[entry.ct]) return [];
      const entryItems = [...itemsByCT[entry.ct]];
      return entry.daysBack
        ? entryItems.filter(item => moment().diff(moment(item.film_date), 'days') < entry.daysBack)
        : entryItems;
    };

    cts.forEach(entry => (items[entry.ct] = getEntryItems(entry)));
    let hasItems = true;
    while (hasItems && cards.length < maxItems) {
      hasItems = false;
      cts.forEach(ct => {
        const curItems = items[ct.ct];
        let count = ct.itemsPerPage ? ct.itemsPerPage : 1;
        while (curItems.length > 0 && count > 0) {
          cards.push(curItems.shift());
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
    onSwipedRight: uiDir === 'rtl' ? onScrollLeft : onScrollRight,
  });

  const renderScrollRight = () => {
    const dir = uiDir === 'rtl' ? 'right' : 'left';
    return pageNo === 0 ? null : (
      <button
        type="button"
        onClick={onScrollLeft}
        className="scroll_intents absolute top-1/2 -translate-y-1/2 border border-gray-300 rounded bg-white p-2 hover:bg-gray-50 large"
        style={{ [dir]: '-40px' }}
      >
        <span className={`material-symbols-outlined`}>chevron_{dir}</span>
      </button>
    );
  };

  const renderScrollLeft = () =>
    (pageNo + 1) * itemsCount >= cardsArray.length ? null : (
      <button
        type="button"
        onClick={onScrollRight}
        className="scroll_intents absolute top-1/2 -translate-y-1/2 border border-gray-300 rounded bg-white p-2 hover:bg-gray-50 large"
        style={{ [leftRight]: '-45px' }}
      >
        <span className={`material-symbols-outlined`}>chevron_{leftRight}</span>
      </button>
    );

  useEffect(() => {
    initCardsArray();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cts]);

  const gridCols = isMobileDevice ? 'grid-cols-1' : 'grid-cols-4';

  const cardsRow = (
    <div
      className={clsx('relative grid gap-4', gridCols, {
        latestUpdatesCardGroup: !isMobileDevice,
        latestUpdatesCardGroupMobile: isMobileDevice,
      })}
    >
      {getPageCardArray()}
      {!isMobileDevice && renderScrollLeft()}
      {!isMobileDevice && renderScrollRight()}
    </div>
  );

  const swipCards = !isMobileDevice ? <div {...swipeHandlers}>{cardsRow}</div> : cardsRow;

  return (
    <>
      <div className="cardsTitle">{title}</div>
      {swipCards}
    </>
  );
};

LatestUpdatesCardList.propTypes = {
  title: PropTypes.string,
  cts: PropTypes.array,
  itemsByCT: PropTypes.any,
};

export default LatestUpdatesCardList;
