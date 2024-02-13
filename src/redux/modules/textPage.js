import { actions as assetsActions } from './assets';
import { selectTextFile, selectMP3, checkRabashGroupArticles } from '../../components/Pages/WithText/helper';
import { assetUrl } from '../../helpers/Api';
import { createSlice } from '@reduxjs/toolkit';
import { getPathnameWithHost } from '../../helpers/url';
import { actions as settingsActions } from './settings';
import { isEmpty } from '../../helpers/utils';
import { selectSuitableLanguage } from '../../helpers/language';

const updateLocalStorage = state => {
  const settings = { ...state.settings };
  localStorage.setItem('library-settings', JSON.stringify(settings));
};

const buildUrl         = (state, pathname) => {
  if (state.file)
    state.urlInfo.search.source_language = state.file.language;

  if (state.urlInfo.isCustom) return state.urlInfo.url;
  if (typeof window === 'undefined') return '';
  pathname = pathname || window.location.pathname.slice(4);

  const _pathname = !state.file ? pathname : `${state.file.language}/${pathname}`;
  return getPathnameWithHost(_pathname);
};

const onChangeLanguage = (state, lang) => {
  if (isEmpty(state.subject?.files)) return;

  state.file = selectTextFile(state.subject.files, state.subject.id, lang);
  state.mp3  = selectMP3(state.subject.files, lang);
  if (!state.urlInfo.isCastom) {
    state.urlInfo.url = buildUrl(state);
  }
};

const textPageSlice = createSlice({
  name: 'textPage',
  initialState: {
    settings: { zoomSize: 2 },
    tocIsActive: false,
    scrollDir: 0,
    match: '',
    subject: {},
    wipErr: {
      wip: false, err: null
    },
    urlInfo: {},
    tocInfo: { sortByAZ: true }
  },
  reducers: {
    setZoomSize: (state, { payload }) => {
      let size = state.settings.zoomSize || 1;
      if (payload === 'up') {
        size = size + 1;
      } else if (payload === 'down') {
        size = size - 1;
      } else {
        size = payload;
      }

      size = Math.min(10, size);
      size = Math.max(0, size);

      state.settings.zoomSize = size;
      updateLocalStorage(state);
    },
    setFontType: (state, { payload }) => {
      state.settings.fontType = payload;
      updateLocalStorage(state);
    },
    setTheme: (state, { payload }) => {
      state.settings.theme = payload;
      updateLocalStorage(state);
    },
    setTocIsActive: (state, { payload }) => void (state.tocIsActive = payload ?? !state.tocIsActive),
    setTocMatch: (state, { payload }) => void (state.tocInfo.match = payload),
    setTocSortBy: state => void (state.tocInfo.sortByAZ = !state.tocInfo.sortByAZ),
    changeLanguage: (state, { payload }) => onChangeLanguage(state, payload),
    setUrlInfo: (state, { payload }) => {
      if (!payload) {
        state.urlInfo.url      = buildUrl(state);
        state.urlInfo.isCastom = false;
        state.urlInfo.search   = {};
      } else {
        state.urlInfo.url      = buildUrl(state, payload.pathname);
        state.urlInfo.search   = payload.search;
        state.urlInfo.isCastom = true;
      }
    },
    setUrlSelect: (state, { payload }) => void (state.urlInfo.select = payload || null),
    setWordOffset: (state, { payload }) => void (state.wordOffset = payload),
    expandNotes: state => void (state.expandNotes = !state.expandNotes),
    setFullscreen: (state, { payload }) => void (state.isFullscreen = payload ?? !state.isFullscreen),
    setScrollDir: (state, { payload }) => void (state.scrollDir = payload),
    setSideOffset: (state, { payload }) => void (state.sideOffset = payload),
    toggleTextOnly: (state, { payload }) => void (state.textOnly = payload ?? !state.textOnly),
    setIsSearch: state => void (state.isSearch = !state.isSearch),
    fetchSubject: {
      prepare: (_id, source_language) => {
        const { uid: id, isGr } = checkRabashGroupArticles(_id);
        return ({ payload: { id, source_language, isGr } });
      },
      reducer: (state, { payload }) => {
        state.wip        = true;
        state.err        = null;
        state.subject.id = payload.id;
      }
    },
    fetchSubjectSuccess: (state, { payload }) => {
      const { subject, file, isGr } = payload;

      subject.properties = isGr ? { uid_prefix: 'gr-' } : {};
      state.subject      = subject;
      state.wipErr       = { wip: false, err: null };
      state.file         = file;
      state.mp3          = selectMP3(subject.files, file.language);
      state.scanFile     = subject.files.find(f => f.insert_type === 'source-scan');
      if (!state.urlInfo.isCastom) {
        state.urlInfo.url = buildUrl(state);
      }
    },
    fetchSubjectFailure: (state, { payload }) => void (state.wipErr = { wip: false, err: payload }),
    setFileFilter: (state, { payload }) => void (state.fileFilter = payload)
  },
  extraReducers: builder => {
    builder
      .addCase(
        assetsActions.mergeKiteiMakorSuccess,
        state => void (state.mp3 = assetUrl(`api/km_audio/file/${state.subject.id}?language=${state.file.language}`))
      )
      .addCase(
        settingsActions.setContentLanguages,
        (state, { payload }) => {
          const language = selectSuitableLanguage(payload.contentLanguages, state.subject.languages, state.subject.original_language);
          onChangeLanguage(state, language);
        }
      );
  }
});

export default textPageSlice.reducer;

export const { actions } = textPageSlice;

export const types = Object.fromEntries(new Map(
  Object.values(textPageSlice.actions).map(a => [a.type, a.type])
));

/* Selectors */
const getSettings     = state => state.settings;
const getTocIsActive  = state => state.tocIsActive;
const getTocInfo      = state => state.tocInfo;
const getSubject      = state => state.subject;
const getWipErr       = state => state.wipErr;
const getFile         = state => state.file;
const getUrlInfo      = state => state.urlInfo;
const getWordOffset   = state => state.wordOffset || 0;
const getMP3          = state => state.mp3;
const getExpandNotes  = state => state.expandNotes;
const getIsFullscreen = state => state.isFullscreen;
const getScrollDir    = state => state.scrollDir;
const getSideOffset   = state => state.sideOffset;
const getTextOnly     = state => state.textOnly;
const getScanFile     = state => state.scanFile;
const getIsSearch     = state => state.isSearch;
const getFileFilter   = state => state.fileFilter;

export const selectors = {
  getSettings,
  getTocIsActive,
  getTocInfo,
  getSubject,
  getWipErr,
  getFile,
  getUrlInfo,
  getWordOffset,
  getMP3,
  getExpandNotes,
  getIsFullscreen,
  getScrollDir,
  getSideOffset,
  getTextOnly,
  getScanFile,
  getIsSearch,
  getFileFilter,
};
