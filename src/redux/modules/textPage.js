import { actions as assetsActions } from './assets';
import { selectTextFile, selectMP3, checkRabashGroupArticles } from '../../components/Pages/WithText/helper';
import { assetUrl } from '../../helpers/Api';
import { createSlice } from '@reduxjs/toolkit';
import { getPathnameWithHost, getQuery } from '../../helpers/url';
import { actions as settingsActions } from './settings';
import { isEmpty } from '../../helpers/utils';
import { selectSuitableLanguage } from '../../helpers/language';
import { CT_SOURCE } from '../../helpers/consts';

const updateLocalStorage = state => {
  localStorage.setItem('library-settings', JSON.stringify(state.settings));
};

const buildUrl = (state, pathname) => {
  if (state.urlInfo.isCustom)
    return state.urlInfo.url;

  if (typeof window === 'undefined')
    return '';

  pathname        = pathname || window.location.pathname.slice(4);
  const _pathname = !state.file ? pathname : `${state.file.language}/${pathname}`;
  return getPathnameWithHost(_pathname);
};

const buildUrlSearch = (state, search = {}) => {
  if (state.file)
    search.source_language = state.file.language;

  if (typeof window === 'undefined') return '';

  const q = getQuery(window.location);
  if (q.page)
    search.page = q.page;

  return search;
};

const onChangeLanguage = (state, lang) => {
  if (isEmpty(state.subject?.files)) return;

  state.file = selectTextFile(state.subject.files, state.subject.id, lang, state.subject.type === CT_SOURCE);
  state.mp3  = selectMP3(state.subject.files, lang);
  if (!state.urlInfo.isCastom) {
    state.urlInfo.url = buildUrl(state);
  }

  const search         = state.urlInfo.isCastom ? state.urlInfo.search : {};
  state.urlInfo.search = buildUrlSearch(state, search);

};

const textPageSlice = createSlice({
  name: 'textPage',
  initialState: {
    settings: { zoomSize: 2, pdfZoom: 1 },
    tocIsActive: false,
    scrollDir: 0,
    match: '',
    subject: {},
    wipErr: {
      wip: false, err: null
    },
    urlInfo: {
      search: {}
    },
    tocInfo: { sortByAZ: true }
  },

  reducers: {
    setZoomSize: (state, { payload }) => {
      let size     = state.settings.zoomSize ?? 2;
      const _isPdf = state.file?.isPdf;
      if (_isPdf) size = state.settings.pdfZoom ?? 1;
      const _coefficient = _isPdf ? .02 : 1;

      if (payload === 'up') {
        size = size + _coefficient;
      } else if (payload === 'down') {
        size = size - _coefficient;
      } else {
        size = _isPdf ? payload?.pdfZoom : payload?.zoomSize;
      }

      size = Math.min(_isPdf ? 1 : 10, size);
      size = Math.max(0, size);

      if (_isPdf)
        state.settings.pdfZoom = size;
      else
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
    setTocIsActive: (state, { payload }) => {
      state.tocInfo.match = '';
      state.tocIsActive   = payload ?? !state.tocIsActive;
    },
    setTocMatch: (state, { payload }) => void (state.tocInfo.match = payload),
    setTocSortBy: state => void (state.tocInfo.sortByAZ = !state.tocInfo.sortByAZ),
    changeLanguage: (state, { payload }) => onChangeLanguage(state, payload),
    setUrlInfo: (state, { payload }) => {
      if (!payload) {
        state.urlInfo.url      = buildUrl(state);
        state.urlInfo.isCastom = false;
      } else {
        state.urlInfo.url      = buildUrl(state, payload.pathname);
        state.urlInfo.isCastom = true;
      }

      state.urlInfo.search = buildUrlSearch(state, { ...payload?.search });
    },
    setUrlSelect: (state, { payload }) => void (state.urlInfo.select = payload || null),
    setWordOffset: (state, { payload }) => void (state.wordOffset = payload),
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
        state.isSearch   = false;
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
  },

  selectors: {
    getSettings: state => state.settings,
    getTocIsActive: state => state.tocIsActive,
    getTocInfo: state => state.tocInfo,
    getSubject: state => state.subject,
    getWipErr: state => state.wipErr,
    getFile: state => state.file,
    getUrlInfo: state => state.urlInfo,
    getWordOffset: state => state.wordOffset || 0,
    getMP3: state => state.mp3,
    getIsFullscreen: state => state.isFullscreen,
    getScrollDir: state => state.scrollDir,
    getSideOffset: state => state.sideOffset,
    getTextOnly: state => state.textOnly,
    getScanFile: state => state.scanFile,
    getIsSearch: state => state.isSearch,
    getFileFilter: state => state.fileFilter
  }
});

export default textPageSlice.reducer;

export const { actions } = textPageSlice;

export const types = Object.fromEntries(new Map(
  Object.values(textPageSlice.actions).map(a => [a.type, a.type])
));

export const selectors = textPageSlice.getSelectors();
