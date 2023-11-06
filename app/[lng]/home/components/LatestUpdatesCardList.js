import React from 'react';
import moment from 'moment';
import LatestUpdateItem from './LatestUpdateItem';
import { getSectionForTranslation } from '../../../../src/helpers/utils';
import { useTranslation } from '../../../i18n';
import LatestUpdatesSlider from './LatestUpdatesSlider';

const LatestUpdatesCardList = async (props) => {
  const { title, maxItems, cts, itemsByCT, lng, stackable } = props;

  const { t } = await useTranslation(lng);

  // arrange cards by type in criss cross order
  const cards = [];
  const items = {};

  const getEntryItems = entry => {
    if (!itemsByCT[entry.ct])
      return [];
    const entryItems = [...itemsByCT[entry.ct]];
    //return entryItems;
    return entry.daysBack ?
      entryItems.filter(item => moment().diff(moment(item.film_date), 'days') < entry.daysBack)
      : entryItems;
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

  const cardsArray = cards.map(item => (
    <LatestUpdateItem
      key={item.id}
      item={item}
      label={t(getSectionForTranslation(item.content_type))}
      lng={lng}
    />
  ));

  return (
    <div className="cardsTitle">
      {title}
      <LatestUpdatesSlider cards={cardsArray} stackable={stackable} />
    </div>
  );
};

export default LatestUpdatesCardList;
