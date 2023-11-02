import { all } from 'redux-saga/effects';

import { sagas as mdb } from '../../lib/redux/slices/mdbSlice/thunks';
import { sagas as preparePage } from '../../lib/redux/slices/preparePageSlice/thunks';
import { sagas as publications } from '../../lib/redux/slices/publicationsSlice/thunks';
import { sagas as events } from './events';
import { sagas as lessons } from './lessons';
import { sagas as filters } from './filters';
import { sagas as filtersAside } from '../../lib/redux/slices/filterSlice/thunks';
import { sagas as lists } from '../../lib/redux/slices/listSlice/thunks';
import { sagas as tags } from '../../lib/redux/slices/tagsSlice/thunks';
import { sagas as settings } from './settings';
import { sagas as search } from '../../lib/redux/slices/searchSlice/thunks';
import { sagas as assets } from '../../app/api/assets';
//import { sagas as home } from '../../lib/redux/slices/homeSlice/home';
import { sagas as stats } from './stats';
import { sagas as simpleMode } from '../../lib/redux/slices/simpleMode/thunks';
import { sagas as recommended } from './recommended';
import { sagas as music } from '../../lib/redux/slices/musicSlice/thunks';
import { sagas as my } from '../../lib/redux/slices/mySlice/thunks';
import { sagas as notes } from './myNotes';
import { sagas as likutim } from './likutim';
import { sagas as trim } from '../../lib/redux/slices/trimSlice/thunks';
import { sagas as playlist } from '../../lib/redux/slices/playlistSlice/thunks';
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
