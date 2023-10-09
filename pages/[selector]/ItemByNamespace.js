import {
  PAGE_NS_LESSONS,
  PAGE_NS_PROGRAMS,
  PAGE_NS_EVENTS,
  COLLECTION_DAILY_LESSONS,
  COLLECTION_LESSONS_TYPE,
  UNIT_LESSONS_TYPE,
  EVENT_TYPES,
  CT_MEAL,
  CT_FRIENDS_GATHERING
} from '../../src/helpers/consts';
import React from 'react';
import DailyLessonItem from '../../src/components/Sections/Lessons/DailyLessonItem';
import CollectionItem from '../../src/components/Sections/Lessons/Collectiontem';
import UnitItem from '../../src/components/Sections/Lessons/UnitItem';
import ItemOfList from '../../src/components/Sections/Programs/ItemOfList';

export default function ItemByNamespace({ namespace, item }) {
  if (namespace === PAGE_NS_LESSONS) {
    const { content_type, id } = item;
    switch (true) {
      case COLLECTION_DAILY_LESSONS.includes(content_type):
        return <DailyLessonItem id={id} key={id} />;
      case COLLECTION_LESSONS_TYPE.includes(content_type):
        return <CollectionItem id={id} key={id} />;
      case UNIT_LESSONS_TYPE.includes(content_type):
        return <UnitItem id={id} key={id} />;
      default:
        return null;
    }
  }

  if (namespace === PAGE_NS_PROGRAMS) {
    const { id } = item;
    return <ItemOfList id={id} key={id} />;
  }

  if (namespace === PAGE_NS_EVENTS) {
    const { content_type, id } = item;
    switch (true) {
      case EVENT_TYPES.includes(content_type):
        return <CollectionItem id={id} key={id} />;
      case [CT_MEAL, CT_FRIENDS_GATHERING].includes(content_type):
        return <UnitItem id={id} key={id} />;
      default:
        return null;
    }
  }
  return null;
}
