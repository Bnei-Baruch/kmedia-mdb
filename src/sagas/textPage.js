import { put, takeEvery, select, call } from 'redux-saga/effects';
import { actions, types } from '../redux/modules/textPage';
import { selectSuitableLanguage } from '../helpers/language';
import { cuToSubject, selectTextFile } from '../components/Pages/WithText/helper';
import { fetchUnit, fetchLabels } from './mdb';
import {
  mdbGetDenormContentUnitSelector,
  settingsGetContentLanguagesSelector,
  mdbGetFullUnitFetchedSelector,
  textPageGetFileFilterSelector,
  textPageGetFileSelector
} from '../redux/selectors';
import { getQuery } from '../helpers/url';
import { CT_SOURCE } from '../helpers/consts';

export function* fetchSubject(action) {
  const { id, isGr } = action.payload;

  try {
    const fetched = yield select(mdbGetFullUnitFetchedSelector)[id];
    if (!fetched) {
      yield call(fetchUnit, { payload: id });
    }

    const cu                      = yield select(state => mdbGetDenormContentUnitSelector(state, id));
    const fileFilter              = yield select(textPageGetFileFilterSelector);
    const { language: _language } = yield select(textPageGetFileSelector) || false;
    const subject                 = cuToSubject(cu, fileFilter);
    const contentLanguages        = yield select(settingsGetContentLanguagesSelector, true);

    const isSource      = subject.type === CT_SOURCE;
    let prefereLanguage = action.payload.source_language || (isSource && _language);
    if (!prefereLanguage && typeof window !== 'undefined') {
      prefereLanguage = getQuery(window.location).source_language;
    }

    prefereLanguage = prefereLanguage || (isSource && cu.original_language);

    const language = selectSuitableLanguage([...contentLanguages, prefereLanguage], subject.languages, prefereLanguage);

    const file = selectTextFile(subject.files, id, language, isSource, fileFilter);
    if (!file) {
      yield put(actions.fetchSubjectFailure(`Failed finding text file for ${id}`));
    } else {
      yield put(actions.fetchSubjectSuccess({ subject, file, isGr }));
      yield fetchLabels({ content_unit: id, language });
    }
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

