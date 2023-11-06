'use client';
import React, { useContext, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Button, Card } from '/lib/SUI';
import clsx from 'clsx';
import { DeviceInfoContext } from '../../../../src/helpers/app-contexts';
import { useSelector } from 'react-redux';
import { selectors as settings } from '../../../../lib/redux/slices/settingsSlice/settingsSlice';

const LatestUpdatesSlider = ({ cards, itemsPerRow = 4, itemsCount = 4, stackable = true }) => {
  const { isMobileDevice }  = useContext(DeviceInfoContext);
  const [pageNo, setPageNo] = useState(0);
  const uiDir               = useSelector(state => settings.getUIDir(state.settings));

  const onScrollRight = () => onScrollChange(pageNo + 1);

  const onScrollLeft = () => onScrollChange(pageNo - 1);

  const onScrollChange = newPageNo => {
    const newPageStart = newPageNo * itemsCount;
    if (newPageNo < 0 || newPageStart >= cards.length) {
      return;
    }

    setPageNo(newPageNo);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: uiDir === 'rtl' ? onScrollRight : onScrollLeft,
    onSwipedRight: uiDir === 'rtl' ? onScrollLeft : onScrollRight
  });

  const renderScrollRight = () => {
    const dir = uiDir === 'rtl' ? 'right' : 'left';
    if (pageNo === 0) return null;

    return (
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

  const renderScrollLeft = () => {
    const dir = uiDir === 'rtl' ? 'left' : 'right';
    if ((pageNo + 1) * itemsCount >= cards.length)
      return null;

    return (
      <Button
        icon={`chevron ${dir}`}
        basic
        size="large"
        onClick={onScrollRight}
        className="scroll_intents left"
        style={{ [dir]: '-45px' }}
      />
    );
  };

  const cardsRow = (
    <Card.Group
      className={
        clsx({
          'latestUpdatesCardGroup': !isMobileDevice,
          'latestUpdatesCardGroupMobile': isMobileDevice
        })
      }
      itemsPerRow={itemsPerRow}
      stackable={stackable}
    >
      {
        cards.slice(pageNo * itemsCount, (pageNo + 1) * itemsCount)
      }
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

  return swipCards;
};

export default LatestUpdatesSlider;
