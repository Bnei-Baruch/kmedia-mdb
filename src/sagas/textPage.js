import { put, takeEvery, select, call } from 'redux-saga/effects';
import { actions, types } from '../redux/modules/textPage';
import { selectSuitableLanguage } from '../helpers/language';
import { cuToSubject, selectTextFile, checkRabashGroupArticles } from '../components/Pages/WithText/helper';
import { fetchUnit } from './mdb';
import {
  mdbGetDenormContentUnitSelector,
  settingsGetContentLanguagesSelector,
  mdbGetFullUnitFetchedSelector,
  textPageGetFileFilterSelector
} from '../redux/selectors';

export function* fetchSubject(action) {
  const { uid: id, isGr } = checkRabashGroupArticles(action.payload);

  try {
    const fetched = yield select(mdbGetFullUnitFetchedSelector)[id];
    if (!fetched) {
      yield call(fetchUnit, { payload: id });
    }

    const cu               = yield select(state => mdbGetDenormContentUnitSelector(state, id));
    const fileFilter       = yield select(textPageGetFileFilterSelector);
    const subject          = cuToSubject(cu, fileFilter);
    const contentLanguages = yield select(settingsGetContentLanguagesSelector);
    const language         = selectSuitableLanguage(contentLanguages, subject.languages, cu.original_language);

    const file = selectTextFile(subject.files, id, language, fileFilter);
    yield put(actions.fetchSubjectSuccess({ subject, file, isGr }));
  } catch (err) {
    yield put(actions.fetchSubjectFailure(err));
  }
}

function* watchFetchSubject() {
  yield takeEvery(types['textPage/fetchSubject'], fetchSubject);
}

export const sagas = [
  watchFetchSubject,
];

