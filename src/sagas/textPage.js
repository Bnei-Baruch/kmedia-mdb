import { put, takeEvery, select, call } from 'redux-saga/effects';
import { actions, types, selectors as textPage } from '../redux/modules/textPage';
import { selectors as mdb } from '../redux/modules/mdb';
import { selectSuitableLanguage } from '../helpers/language';
import { LANG_HEBREW, DEFAULT_CONTENT_LANGUAGE } from '../helpers/consts';
import { selectors as settings } from '../redux/modules/settings';
import { cuToSubject, selectTextFile, checkRabashGroupArticles } from '../components/Pages/WithText/helper';
import { fetchUnit } from './mdb';

export function* fetchSubject(action) {
  const { uid: id, isGr } = checkRabashGroupArticles(action.payload);

  try {
    yield call(fetchUnit, { payload: id });
    const cu               = yield select(state => mdb.getDenormContentUnit(state.mdb, id));
    const fileFilter       = yield select(state => textPage.getFileFilter(state.textPage));
    const subject          = cuToSubject(cu, fileFilter);
    const contentLanguages = yield select(state => settings.getContentLanguages(state.settings));
    const language         = selectSuitableLanguage(contentLanguages, subject.languages, cu.original_language);

    const file = selectTextFile(subject.files, id, language, fileFilter);
    yield put(actions.fetchSubjectSuccess({ subject, file, isGr }));
  } catch (err) {
    yield put(actions.fetchSubjectFailure(err));
  }
}

function* watchFetchSubject() {
  yield takeEvery([types.FETCH_SUBJECT], fetchSubject);
}

export const sagas = [
  watchFetchSubject,
];

