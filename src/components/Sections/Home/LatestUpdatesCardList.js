import React, { useState } from 'react';
import { Swipeable } from 'react-swipeable';
import { Button, Card } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import * as consts from '../../../helpers/consts';
import { withNamespaces } from 'react-i18next';
import LatestUpdate from './LatestUpdate';
import { getSectionForTranslation } from '../../../helpers/utils';
import Section from './Section';

const LatestUpdatesCardList = ({ t, title, cts, itemsByCT, itemsCount=4 }) => {

  const [pageNo, setPageNo] = useState(0);

  const [pageStart, setPageStart] = useState(0);

  const onScrollRight = () => onScrollChange(pageNo + 1);

  const onScrollLeft = () => onScrollChange(pageNo - 1);

  const getLatestUpdate = item =>
    <LatestUpdate key={item.id} item={item} label={t(getSectionForTranslation(item.content_type))} t={t} />;

  const getCardArray = () =>
    [].concat.apply([], cts.map(ct => itemsByCT[ct]));

  const getPageCardArray = () =>
    getCardArray()?.slice(pageStart, pageStart + itemsCount).map(item => getLatestUpdate(item));

  const onScrollChange = newPageNo => {
    const newPageStart = newPageNo * itemsCount;
    if (newPageNo < 0 || newPageStart >= getCardArray()?.length) {
      return;
    }

    setPageNo(newPageNo);
    setPageStart(newPageStart);
  };

  const getSwipeProps = () => {
    const isRTL = true;//isLanguageRtl(this.props.language);
    return {
      onSwipedLeft: isRTL ? onScrollRight : onScrollLeft,
      onSwipedRight: isRTL ? onScrollLeft : onScrollRight
    };
  };


  const renderScrollRight = () => {
    //const dir = isLanguageRtl(this.props.language) ? 'right' : 'left';
    const dir = 'right';
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
    const dir = 'left';
    return (pageNo+1) * itemsCount >= getCardArray()?.length ? null : (
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
  title: PropTypes.string,
  cts: PropTypes.array,
  itemsByCT: PropTypes.any
};

export default withNamespaces()(LatestUpdatesCardList);
