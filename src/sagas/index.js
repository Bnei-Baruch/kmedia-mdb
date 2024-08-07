import { all } from 'redux-saga/effects';

import { sagas as mdb } from './mdb';
import { sagas as preparePage } from './preparePage';
import { sagas as publications } from './publications';
import { sagas as events } from './events';
import { sagas as lessons } from './lessons';
import { sagas as filters } from './filters';
import { sagas as filtersAside } from './filtersAside';
import { sagas as lists } from './lists';
import { sagas as tags } from './tags';
import { sagas as settings } from './settings';
import { sagas as search } from './search';
import { sagas as assets } from './assets';
import { sagas as home } from './home';
import { sagas as stats } from './stats';
import { sagas as recommended } from './recommended';
import { sagas as my } from './my';
import { sagas as myNotes } from './myNotes';
import { sagas as likutim } from './likutim';
import { sagas as trim } from './trim';
import { sagas as playlist } from './playlist';
import { sagas as fetchImage } from './fetchImage';
import { sagas as textPage } from './textPage';

const allSagas = [
  ...mdb,
  ...preparePage,
  ...publications,
  ...events,
  ...lessons,
  ...filters,
  ...filtersAside,
  ...lists,
  ...tags,
  ...settings,
  ...search,
  ...assets,
  ...home,
  ...stats,
  ...recommended,
  ...my,
  ...myNotes,
  ...likutim,
  ...trim,
  ...playlist,
  ...fetchImage,
  ...textPage
];

export function* rootSaga() {
  yield all(allSagas.map(s => s()));
}
