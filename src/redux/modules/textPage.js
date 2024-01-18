import { actions as assetsActions } from './assets';
import { selectTextFile, selectMP3 } from '../../components/Pages/WithText/helper';
import { assetUrl } from '../../helpers/Api';
import { createSlice } from '@reduxjs/toolkit';

const updateLocalStorage = state => {
  const settings = { ...state.settings };
  localStorage.setItem('library-settings', JSON.stringify(settings));
};

const buildUrl = state => {
  if (typeof window === 'undefined') return '';

  const { protocol, hostname, port, pathname } = window.location;

  const _pathname = !state.file ? pathname : `${state.file.language}/${pathname.slice(4)}`;
  return `${protocol}//${hostname}${port ? `:${port}` : ''}/${_pathname}`;

};

const textPageSlice = createSlice({
  name: 'textPage',
  initialState: {
    settings: {},
    tocIsActive: false,
    scrollDir: 0,
    match: '',
    subject: {},
    wipErr: {
      wip: false, err: null
    },
    urlInfo: {},
    tocInfo: { sortByAZ: true },
    scanInfo: { on: false }
  },
  reducers: {
    setZoomSize: (state, { payload }) => {
      let size = state.settings.zoomSize || 1;
      if (payload === 'up') {
        size = size + .2;
      } else if (payload === 'down') {
        size = size - .2;
      } else {
        size = payload;
      }

      size = Math.min(4, size);
      size = Math.max(1, size);

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
    changeLanguage: (state, { payload }) => {
      state.file = selectTextFile(state.subject.files, state.subject.id, payload);
      state.mp3  = selectMP3(state.subject.files, payload);

      state.urlInfo.url = buildUrl(state);
    },
    setUrlPath: (state, { payload }) => void (state.urlInfo.url = payload ?? buildUrl(state)),
    setUrlSelect: (state, { payload }) => void (state.urlInfo.select = payload || null),
    setWordOffset: (state, { payload }) => void (state.wordOffset = payload),
    expandNotes: state => void (state.expandNotes = !state.expandNotes),
    setFullscreen: (state, { payload }) => void (state.isFullscreen = payload ?? !state.isFullscreen),
    setScrollDir: (state, { payload }) => void (state.scrollDir = payload),
    setSideOffset: (state, { payload }) => void (state.sideOffset = payload),
    toggleTextOnly: (state, { payload }) => void (state.textOnly = payload ?? !state.textOnly),
    toggleScan: state => void (state.scanInfo.on = !state.scanInfo.on),
    setIsSearch: state => void (state.isSearch = !state.isSearch),
    fetchSubject: (state, { payload }) => {
      state.wip        = true;
      state.err        = null;
      state.subject.id = payload;
    },
    fetchSubjectSuccess: (state, { payload }) => {
      const { subject, file, isGr } = payload;

      subject.properties  = isGr ? { uid_prefix: 'gr-' } : {};
      state.subject       = subject;
      state.wipErr        = { wip: false, err: null };
      state.file          = file;
      state.mp3           = selectMP3(subject.files, file.language);
      state.scanInfo.file = subject.files.find(f => f.insert_type === 'source-scan');
      state.urlInfo.url   = buildUrl(state);
    },
    fetchSubjectFailure: (state, { payload }) => void (state.wipErr = { wip: false, err: payload }),
    setFileFilter: (state, { payload }) => void (state.fileFilter = payload)
  },
  extraReducers: builder => {
    builder
      .addCase(
        assetsActions.mergeKiteiMakorSuccess,
        state => void (state.mp3 = assetUrl(`api/km_audio/file/${state.subject.id}?language=${state.file.language}`))
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
const getScanInfo     = state => state.scanInfo;
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
  getScanInfo,
  getIsSearch,
  getFileFilter,
};
