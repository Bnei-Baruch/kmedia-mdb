import { call, put, select, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { actions, types } from '../redux/modules/tags';
import { selectors as settings } from '../redux/modules/settings';
import { actions as mdb } from '../redux/modules/mdb';

function* fetchTags() {
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const { data } = yield call(Api.tags, { language });
    yield put(actions.fetchTagsSuccess(data));
  } catch (err) {
    yield put(actions.fetchTagsFailure(err));
  }
}

function* watchFetchTags() {
  yield takeLatest(types.FETCH_TAGS, fetchTags);
}

function* fetchDashboard(action){
  const id = action.payload; 

  try{
    const language = yield select(state => settings.getLanguage(state.settings));
    const { data } = yield call(Api.tagDashboard, {id, language });
    console.log('SAGA fetchDashboard data', data);

    if (data && Array.isArray(data.latest_units)){
      yield put(mdb.receiveContentUnits(data.latest_units));
      //yield put(mdb.receiveContentUnits(data.promoted_units));
    }
   
    yield put(actions.fetchDashboardSuccess(id, data));
  } catch (err) {
    console.log('SAGA fetchDashboard error', err);
    yield put(actions.fetchDashboardFailure(id, err));
  }
}

function* watchFetchDashboard(){
  yield takeLatest(types.FETCH_DASHBOARD, fetchDashboard);
}

export const sagas = [
  watchFetchTags,
  watchFetchDashboard
];
