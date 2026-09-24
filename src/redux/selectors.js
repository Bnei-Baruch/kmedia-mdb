import { createSelector } from '@reduxjs/toolkit';

import { selectors as authSel } from './modules/auth';
import { selectors as settingsSel } from './modules/settings';
import { selectors as homeSel } from './modules/home';
import { selectors as mdbSel } from './modules/mdb';
import { selectors as publicationsSel } from './modules/publications';
import { selectors as filtersSel } from './modules/filters';
import { selectors as filtersAsideSel } from './modules/filtersAside';
import { selectors as eventsSel } from './modules/events';
import { selectors as tagsSel } from './modules/tags';
import { selectors as sourcesSel } from './modules/sources';
import { selectors as statsSel } from './modules/stats';
import { selectors as playlistSel } from './modules/playlist';
import { selectors as mySel } from './modules/my';
import { selectors as recommendedSel } from './modules/recommended';
import { selectors as playerSel } from './modules/player';
import { selectors as assetsSel } from './modules/assets';
import { selectors as chroniclesSel } from './modules/chronicles';
import { selectors as searchSel } from './modules/search';
import { selectors as listsSel } from './modules/lists';
import { selectors as lessonsSel } from './modules/lessons';
import { selectors as bookmarkFilterSel } from './modules/bookmarkFilter';
import { selectors as trimSel } from './modules/trim';
import { selectors as fetchImageSel } from './modules/fetchImage';
import { selectors as myNotesSel } from './modules/myNotes';
import { selectors as textPageSel } from './modules/textPage';
import { selectors as likutimSel } from './modules/likutim';

// Select part of state (first parameter)
export const getMDB     = state => state.mdb;
const getAuth           = state => state.auth;
const getEvents         = state => state.events;
const getFilters        = state => state.filters;
const getFiltersAside   = state => state.filtersAside;
const getHome           = state => state.home;
const getPublications   = state => state.publications;
const getSettings       = state => state.settings;
const getTags           = state => state.tags;
const getSources        = state => state.sources;
const getStats          = state => state.stats;
const getPlaylist       = state => state.playlist;
const getMy             = state => state.my;
const getRecommended    = state => state.recommended;
const getPlayer         = state => state.player;
const getAssets         = state => state.assets;
const getChronicles     = state => state.chronicles;
const getSearch         = state => state.search;
const getLists          = state => state.lists;
const getLessons        = state => state.lessons;
const getBookmarkFilter = state => state.bookmarkFilter;
const getTrim           = state => state.trim;
const getFetchImage     = state => state.fetchImage;
const getMyNotes        = state => state.myNotes;
const getTextPage       = state => state.textPage;
const getLikutim        = state => state.likutim;

// Select additional parameters
const _2 = (_, param) => param;
const _3 = (_, __, param) => param;
const _4 = (_, __, ___, param) => param;

// auth
export const authGetUserSelector = createSelector([getAuth], auth => authSel.getUser(auth));

// settings
export const settingsGetContentLanguagesSelector = createSelector(getSettings, _2, (s, skip) => settingsSel.getContentLanguages(s, skip));
export const settingsGetUILangSelector           = createSelector(getSettings, _2, (s, skip) => settingsSel.getUILang(s, skip));
export const settingsGetUrlLangSelector          = createSelector(getSettings, s => settingsSel.getUrlLang(s));
export const settingsGetUIDirSelector            = createSelector([getSettings], s => settingsSel.getUIDir(s));
export const settingsGetShowAllContentSelector   = createSelector([getSettings], s => settingsSel.getShowAllContent(s));
export const settingsGetPageSizeSelector         = createSelector([getSettings], s => settingsSel.getPageSize(s));
export const settingsGetLeftRightByDirSelector   = createSelector([getSettings], s => settingsSel.getUIDir(s) === 'rtl' ? 'left' : 'right');
export const settingsGetRightLeftByDirSelector   = createSelector([getSettings], s => settingsSel.getUIDir(s) !== 'rtl' ? 'left' : 'right');

// home
export const homeLatestCoIDsSelector    = createSelector([getHome], home => homeSel.getLatestCos(home));
export const homeLatestUnitIDsSelector  = createSelector([getHome], home => homeSel.getLatestUnits(home));
export const homeLatestLessonIDSelector = createSelector([getHome], home => homeSel.getLatestLesson(home));
export const homeFetchTimestampSelector = createSelector([getHome], home => homeSel.getFetchTimestamp(home));
export const homeGetBannerSelector      = createSelector([getHome], home => homeSel.getBanner(home));
export const homeWipSelector            = createSelector([getHome], home => homeSel.getWip(home));
export const homeErrSelector            = createSelector([getHome], home => homeSel.getError(home));

// mdb
export const mdbLatestLessonSelector                 = createSelector(getMDB, _2, (m, latestLessonID) => latestLessonID ? mdbSel.getCollectionById(m, latestLessonID) : null);
export const mdbLatestUnitsSelector                  = createSelector(getMDB, _2, (m, latestUnitIDs) => Array.isArray(latestUnitIDs) ? latestUnitIDs.map(x => mdbSel.getDenormContentUnit(m, x)) : []);
export const mdbGetFullUnitFetchedSelector           = createSelector([getMDB], m => mdbSel.getFullUnitFetched(m));
export const mdbLatestCosSelector                    = createSelector(getMDB, _2, (m, latestCoIDs) => latestCoIDs.map(x => mdbSel.getDenormCollection(m, x)));
export const mdbGetCollectionByIdSelector            = createSelector(getMDB, _2, (m, cids) => cids.map(x => mdbSel.getCollectionById(m, x)));
export const mdbGetDenormCollectionSelector          = createSelector(getMDB, _2, (m, id) => mdbSel.getDenormCollection(m, id));
export const mdbGetDenormCollectionArrSelector       = createSelector(getMDB, _2, (m, cIDs) => cIDs.map(x => mdbSel.getDenormCollection(m, x)).filter(c => !!c));
export const mdbNestedGetDenormCollectionSelector    = createSelector([getMDB], m => mdbSel.nestedGetDenormCollection(m));
export const mdbGetTreeSelector                      = createSelector(getMDB, _2, _3, _4, (state, namespace, t, fn) => fn(state, namespace, t));
export const mdbNestedGetCollectionByIdSelector      = createSelector([getMDB], m => mdbSel.nestedGetCollectionById(m));
export const mdbGetPersonByIdSelector                = createSelector([getMDB], m => mdbSel.getPersonById(m));
export const mdbGetWindowSelector                    = createSelector([getMDB], m => mdbSel.getWindow(m));
export const mdbGetWipFn                             = createSelector([getMDB], m => mdbSel.getWip(m));
export const mdbGetErrorsSelector                    = createSelector([getMDB], m => mdbSel.getErrors(m));
export const mdbGetFullCollectionFetchedSelector     = createSelector([getMDB], m => mdbSel.getFullCollectionFetched(m));
export const mdbGetLastLessonIdSelector              = createSelector([getMDB], m => mdbSel.getLastLessonId(m));
export const mdbGetDatepickerCOSelector              = createSelector([getMDB], m => mdbSel.getDatepickerCO(m));
export const mdbNestedGetDenormContentUnitSelector   = createSelector([getMDB], m => mdbSel.nestedGetDenormContentUnit(m));
export const mdbNestedDenormCollectionWUnitsSelector = createSelector([getMDB], m => mdbSel.nestedGetDenormContentUnit(m));
export const mdbGetDenormCollectionWUnitsSelector    = createSelector(getMDB, _2, (m, id) => mdbSel.getDenormCollectionWUnits(m, id));
export const mdbGetDenormContentUnitSelector         = createSelector(getMDB, _2, (m, id) => mdbSel.getDenormContentUnit(m, id));
export const mdbGetDenormLabelSelector               = createSelector([getMDB], m => mdbSel.getDenormLabel(m));
export const mdbGetLabelsByCUSelector                = createSelector(getMDB, _2, (m, id) => mdbSel.getLabelsByCU(m, id));
export const mdbGetLabelsById                        = createSelector(getMDB, m => mdbSel.getLabelById(m));
export const mdbGetCollectionsByCt                   = createSelector(getMDB, _2, (m, ct) => mdbSel.getCollectionIdsByCt(m, ct));

// publications
export const publicationsLatestBlogPostsSelector  = createSelector([getPublications], pubs => publicationsSel.getBlogPosts(pubs));
export const publicationsGetBlogPostSelector      = createSelector(getPublications, _2, _3, (pubs, blog, id) => publicationsSel.getBlogPost(pubs, blog, id));
export const publicationsLatestTweetsSelector     = createSelector([getPublications], pubs => publicationsSel.getTweets(pubs));
export const publicationsGetPublisherByIdSelector = createSelector([getPublications], pubs => publicationsSel.getPublisherById(pubs));
export const publicationsGetTwitterSelector       = createSelector(getPublications, _2, (p, id) => publicationsSel.getTwitter(p, id));
export const publicationsGetTweetsWipSelector     = createSelector([getPublications], p => publicationsSel.getTweetsWip(p));
export const publicationsGetTweetsErrorSelector   = createSelector([getPublications], p => publicationsSel.getTweetsError(p));
export const publicationsGetBlogWipSelector       = createSelector([getPublications], p => publicationsSel.getBlogWipPost(p));
export const publicationsGetBlogErrorSelector     = createSelector([getPublications], p => publicationsSel.getBlogErrorPost(p));

// filters
export const filtersGetIsHydratedSelector      = createSelector(getFilters, _2, (f, ns) => filtersSel.getIsHydrated(f, ns));
export const filtersGetFiltersSelector         = createSelector(getFilters, _2, (f, namespace) => filtersSel.getFilters(f, namespace));
export const filtersGetNotEmptyFiltersSelector = createSelector(getFilters, _2, (f, namespace) => filtersSel.getNotEmptyFilters(f, namespace));
export const filtersGetFilterByNameSelector    = createSelector(getFilters, _2, _3, (f, namespace, name) => filtersSel.getFilterByName(f, namespace, name));

// filtersAside
export const filtersAsideGetMultipleStatsSelector = createSelector(getFiltersAside, _2, _3, _4, (fa, ns, name, preset) => {
  const f = filtersAsideSel.getMultipleStats(fa, ns, name);
  return f(preset);
});
export const filtersAsideGetStatsSelector         = createSelector(getFiltersAside, _2, _3, (fa, ns, name) => filtersAsideSel.getStats(fa, ns, name));
export const filtersAsideGetTreeSelector          = createSelector(getFiltersAside, _2, _3, (fa, ns, name) => filtersAsideSel.getTree(fa, ns, name));
export const filtersAsideGetIsReadySelector       = createSelector(getFiltersAside, _2, (fa, ns) => filtersAsideSel.isReady(fa, ns));
export const filtersAsideCitiesByCountrySelector  = createSelector(getFiltersAside, _2, _3, (fa, ns, name) => filtersAsideSel.citiesByCountry(fa, ns, name));
export const filtersAsideGetWipErrSelector        = createSelector(getFiltersAside, _2, (fa, ns) => filtersAsideSel.getWipErr(fa, ns));

// events
export const eventsGetEventByTypeSelector = createSelector(getEvents, _2, (e, name) => eventsSel.getEventsByType(e)[name]);

// tags
export const tagsGetTagsSelector         = createSelector([getTags], t => tagsSel.getTags(t));
export const tagsGetTagByIdSelector      = createSelector([getTags], t => tagsSel.getTagById(t));
export const tagsGetItemsSelector        = createSelector([getTags], t => tagsSel.getItems(t));
export const tagsGetRootsSelector        = createSelector([getTags], t => tagsSel.getRoots(t));
export const tagsGetDisplayRootsSelector = createSelector([getTags], t => tagsSel.getDisplayRoots(t));
export const tagsGetPathByIDSelector     = createSelector([getTags], t => tagsSel.getPathByID(t));
export const tagsAreLoadedSelector       = createSelector([getTags], t => tagsSel.areTagsLoaded(t));

// sources
export const sourcesGetRootsSelector      = createSelector([getSources], s => sourcesSel.getRoots(s));
export const sourcesGetSourceByIdSelector = createSelector([getSources], s => sourcesSel.getSourceById(s));
export const sourcesGetPathByIDSelector   = createSelector([getSources], s => sourcesSel.getPathByID(s));
export const sourcesAreLoadedSelector     = createSelector([getSources], s => sourcesSel.areSourcesLoaded(s));

// stats
export const statsGetCUSelector = createSelector(getStats, _2, (s, ns) => statsSel.getCUStats(s, ns));

// playlist
export const playlistGetInfoSelector      = createSelector([getPlaylist], p => playlistSel.getInfo(p));
export const playlistGetPrevIdSelector    = createSelector([getPlaylist], p => playlistSel.getPrevId(p));
export const playlistGetNextIdSelector    = createSelector([getPlaylist], p => playlistSel.getNextId(p));
export const playlistGetFetchedSelector   = createSelector([getPlaylist], p => playlistSel.getFetched(p));
export const playlistGetPlaylistSelector  = createSelector([getPlaylist], p => playlistSel.getPlaylist(p));
export const playlistGetItemByIdSelector  = createSelector([getPlaylist], p => playlistSel.getItemById(p));
export const playlistGetPlayedSelector    = createSelector([getPlaylist], p => playlistSel.getPlayed(p));
export const playlistGetIndexByIdSelector = createSelector(getPlaylist, _2, (p, id) => playlistSel.getIndexById(p, id));

// player
export const playerGetOverModeSelector      = createSelector([getPlayer], p => playerSel.getOverMode(p));
export const playerGetFileSelector          = createSelector([getPlayer], p => playerSel.getFile(p));
export const playerIsReadySelector          = createSelector([getPlayer], p => playerSel.isReady(p));
export const playerIsMetadataReadySelector  = createSelector([getPlayer], p => playerSel.isMetadataReady(p));
export const playerIsPlaySelector           = createSelector([getPlayer], p => playerSel.isPlay(p));
export const playerIsFullScreenSelector     = createSelector([getPlayer], p => playerSel.isFullScreen(p));
export const playerIsMutedSelector          = createSelector([getPlayer], p => playerSel.isMuted(p));
export const playerIsLoadedSelector         = createSelector([getPlayer], p => playerSel.isLoaded(p));
export const playerGetShareStartEndSelector = createSelector([getPlayer], p => playerSel.getShareStartEnd(p));
export const playerGetPlayerWidthSelector   = createSelector([getPlayer], p => playerSel.getPlayerWidth(p));
export const playerGetKeyboardCoefSelector  = createSelector([getPlayer], p => playerSel.getKeyboardCoef(p));
export const playerGetRateSelector          = createSelector([getPlayer], p => playerSel.getRate(p));

// my
export const myGetListSelector           = createSelector(getMy, _2, (m, ns) => mySel.getList(m, ns));
export const myGetInfoSelector           = createSelector(getMy, _2, (m, ns) => mySel.getInfo(m, ns));
export const myGetReactionsCountSelector = createSelector(getMy, _2, (m, key) => mySel.getReactionsCount(m, key));
export const myGetItemByKeySelector      = createSelector(getMy, _2, _3, (r, ns, key) => mySel.getItemByKey(r, ns, key));
export const myGetDeletedSelector        = createSelector(getMy, _2, (m, ns) => mySel.getDeleted(m, ns));
export const myGetWipSelector            = createSelector(getMy, _2, (m, ns) => mySel.getWIP(m, ns));
export const myGetErrSelector            = createSelector(getMy, _2, (m, ns) => mySel.getErr(m, ns));
export const myGetPageNoSelector         = createSelector(getMy, _2, (m, ns) => mySel.getPageNo(m, ns));
export const myGetTotalSelector          = createSelector(getMy, _2, (m, ns) => mySel.getTotal(m, ns));

// recommended
export const recommendedGetViewsSelector           = createSelector(getRecommended, _2, (r, id) => recommendedSel.getViews(r, id));
export const recommendedGetItemsSelector           = createSelector(getRecommended, _2, (r, feedName) => recommendedSel.getRecommendedItems(r, feedName));
export const recommendedGetManyItemsSelector       = createSelector(getRecommended, _2, (r, feedName) => recommendedSel.getManyRecommendedItems(r, feedName));
export const recommendedGetManyViewsSelector       = createSelector(getRecommended, _2, (r, units) => recommendedSel.getManyViews(r, units.map(unit => unit.id)));
export const recommendedGetManyWatchingNowSelector = createSelector(getRecommended, _2, (r, units) => recommendedSel.getManyWatchingNow(r, units.map(unit => unit.id)));
export const recommendedGetWipFn                   = createSelector([getRecommended], r => recommendedSel.getWip(r));
export const recommendedGetErrorSelector           = createSelector([getRecommended], r => recommendedSel.getError(r));

// assets
export const assetsGetSourceIndexByIdSelector = createSelector([getAssets], a => assetsSel.getSourceIndexById(a));
export const assetsGetDoc2htmlByIdSelector    = createSelector([getAssets], a => assetsSel.getDoc2htmlById(a));
export const assetsGetPersonSelector          = createSelector([getAssets], a => assetsSel.getPerson(a));
export const assetsGetAboutSelector           = createSelector([getAssets], a => assetsSel.getAbout(a));
export const assetsGetMergeStatusSelector     = createSelector([getAssets], a => assetsSel.getMergeStatus(a));
export const assetsNestedGetZipByIdSelector   = createSelector([getAssets], a => assetsSel.nestedGetZipById(a));
export const assetsGetTimeCodeSelector        = createSelector([getAssets], a => assetsSel.getTimeCode(a));
export const assetsHasTimeCodeSelector        = createSelector([getAssets], a => assetsSel.hasTimeCode(a));

// chronicles
export const chroniclesGetEventSelector       = createSelector([getChronicles], c => chroniclesSel.getEvent(c));
export const chroniclesGetLastActionSelector  = createSelector([getChronicles], c => chroniclesSel.getLastAction(c));
export const chroniclesGetActionCountSelector = createSelector([getChronicles], c => chroniclesSel.getActionsCount(c));

// search
export const searchGetSortBySelector           = createSelector(getSearch, _2, (s, ns) => searchSel.getSortBy(s, ns));
export const searchGetQuerySelector            = createSelector([getSearch], s => searchSel.getQuery(s));
export const searchGetDebSelector              = createSelector([getSearch], s => searchSel.getDeb(s));
export const searchGetPrevQuerySelector        = createSelector([getSearch], s => searchSel.getPrevQuery(s));
export const searchGetSuggestionsSelector      = createSelector([getSearch], s => searchSel.getSuggestions(s));
export const searchGetAutocompleteWipSelector  = createSelector([getSearch], s => searchSel.getAutocompleteWip(s));
export const searchGetQueryResultSelector      = createSelector([getSearch], s => searchSel.getQueryResult(s));
export const searchGetWipSelector              = createSelector([getSearch], s => searchSel.getWip(s));
export const searchGetErrorSelector            = createSelector([getSearch], s => searchSel.getError(s));
export const searchGetPageNoSelector           = createSelector([getSearch], s => searchSel.getPageNo(s));
export const searchGetPrevFilterParamsSelector = createSelector([getSearch], s => searchSel.getPrevFilterParams(s));

// lists
export const listsGetNamespaceStateSelector = createSelector(getLists, _2, (l, ns) => listsSel.getNamespaceState(l, ns));

// lessons
export const lessonsGetSeriesBySourceIdSelector = createSelector(getLessons, getMDB, getSources, (l, m, s) => lessonsSel.getSerieBySourceId(l, m, s));
export const lessonsGetSeriesByTagIdSelector    = createSelector(getLessons, getMDB, getTags, (l, m, t) => lessonsSel.getSerieByTagId(l, m, t));
export const lessonsGetWipSelector              = createSelector([getLessons], l => lessonsSel.getWip(l));
export const lessonsGetSeriesLoaded             = createSelector([getLessons], l => lessonsSel.getSeriesLoaded(l));

// bookmarkFilter
export const bookmarkFilterGetByKeySelector = createSelector(getBookmarkFilter, _2, (b, ns) => bookmarkFilterSel.getByKey(b, ns));

// trim
export const trimGetListSelector = createSelector([getTrim], t => trimSel.getList(t));
export const trimGetWipsSelector = createSelector([getTrim], t => trimSel.getWIPs(t));

// fetchImage
export const fetchImageGetBySrcSelector = createSelector(getFetchImage, _2, (i, src) => fetchImageSel.getBySrc(i, src));

// myNotes
export const myNotesGetListSelector     = createSelector([getMyNotes], n => myNotesSel.getList(n));
export const myNotesGetByIdSelector     = createSelector(getMyNotes, n => myNotesSel.getById(n));
export const myNotesGetSelectedSelector = createSelector([getMyNotes], n => myNotesSel.getSelected(n));
export const myNotesGetStatusSelector   = createSelector([getMyNotes], n => myNotesSel.getStatus(n));

//textPage
export const textPageGetSettings              = createSelector([getTextPage], t => textPageSel.getSettings(t));
export const textPageGetTocIsActiveSelector   = createSelector([getTextPage], t => textPageSel.getTocIsActive(t));
export const textPageGetTocInfoSelector       = createSelector([getTextPage], t => textPageSel.getTocInfo(t));
export const textPageGetSubjectSelector       = createSelector([getTextPage], t => textPageSel.getSubject(t));
export const textPageGetWipErrSelector        = createSelector([getTextPage], t => textPageSel.getWipErr(t));
export const textPageGetFileSelector          = createSelector([getTextPage], t => textPageSel.getFile(t) || false);
export const textPageGetUrlInfoSelector       = createSelector([getTextPage], t => textPageSel.getUrlInfo(t));
export const textPageGetWordOffsetSelector    = createSelector([getTextPage], t => textPageSel.getWordOffset(t));
export const textPageGetMP3Selector           = createSelector([getTextPage], t => textPageSel.getMP3(t));
export const textPageGetIsFullscreenSelector  = createSelector([getTextPage], t => textPageSel.getIsFullscreen(t));
export const textPageGetScrollDirSelector     = createSelector([getTextPage], t => textPageSel.getScrollDir(t));
export const textPageGetSideOffsetSelector    = createSelector([getTextPage], t => textPageSel.getSideOffset(t));
export const textPageGetAdditionsModeSelector = createSelector([getTextPage], t => textPageSel.getAdditionsMode(t));
export const textPageGetScanFileSelector      = createSelector([getTextPage], t => textPageSel.getScanFile(t));
export const textPageGetIsSearchSelector      = createSelector([getTextPage], t => textPageSel.getIsSearch(t));
export const textPageGetFileFilterSelector    = createSelector([getTextPage], t => textPageSel.getFileFilter(t));

//likutim
export const likutimGetByTag    = createSelector([getLikutim], l => likutimSel.getByTag(l));
export const likutimGetWipByKey = createSelector(getLikutim, _2, (l, key) => likutimSel.getWip(l, key));
export const likutimGetErrByKey = createSelector(getLikutim, _2, (l, key) => likutimSel.getError(l, key));
