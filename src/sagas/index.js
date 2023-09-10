import { all } from 'redux-saga/effects';

import { sagas as mdb } from './mdb';
import { sagas as preparePage } from './preparePage';
import { sagas as publications } from '../../lib/redux/slices/publicationsSlice/thunks';
import { sagas as events } from './events';
import { sagas as lessons } from './lessons';
import { sagas as filters } from './filters';
import { sagas as filtersAside } from './filtersAside';
import { sagas as lists } from './lists';
import { sagas as tags } from '../../lib/redux/slices/tagsSlice/thunks';
import { sagas as settings } from './settings';
import { sagas as search } from './search';
import { sagas as assets } from './assets';
//import { sagas as home } from '../../lib/redux/slices/homeSlice/home';
import { sagas as stats } from './stats';
import { sagas as simpleMode } from './simpleMode';
import { sagas as recommended } from './recommended';
import { sagas as music } from './music';
import { sagas as my } from './my';
import { sagas as notes } from './myNotes';
import { sagas as likutim } from './likutim';
import { sagas as trim } from '../../lib/redux/slices/trimSlice/thunks';
import { sagas as playlist } from './playlist';
import { sagas as fetchImage } from '../../lib/redux/slices/imageSlice/thunks';

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
  //...home,
  ...stats,
  ...simpleMode,
  ...recommended,
  ...music,
  ...my,
  ...notes,
  ...music,
  ...likutim,
  ...trim,
  ...playlist,
  ...fetchImage
];

export function* rootSaga() {
  yield all(allSagas.map(s => s()));
}
