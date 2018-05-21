/* eslint-disable react/no-multi-comp */

import React from 'react';
import { renderRoutes } from 'react-router-config';

import { DEFAULT_LANGUAGE } from './helpers/consts';
import LanguageSetter from './components/Language/LanguageSetter';
import Layout from './components/Layout/Layout';
import Lessons from './components/Sections/Lessons/List';
import LessonUnit from './components/Sections/Lessons/Unit';
import LessonCollection from './components/Sections/Lessons/Collection';
import Programs from './components/Sections/Programs/List';
import ProgramUnit from './components/Sections/Programs/Unit';
import ProgramCollection from './components/Sections/Programs/Collection';
import Lectures from './components/Sections/Lectures/MainPage';
import LectureUnit from './components/Sections/Lectures/Unit';
import LectureCollection from './components/Sections/Lectures/Collection';
import Publications from './components/Sections/Publications/List';
import PublicationUnit from './components/Sections/Publications/Unit';
import PublicationCollection from './components/Sections/Publications/Collection';
import Events from './components/Sections/Events/MainPage';
import EventUnit from './components/Sections/Events/Unit';
import EventCollection from './components/Sections/Events/Collection';
import LibraryHomepage from './components/Sections/Library/Homepage';
import LibraryContainer from './components/Sections/Library/LibraryContainer';
import SearchResults from './components/Search/SearchResultsContainer';
import Redirect from './components/Layout/Redirect';
import HomePage from './components/Sections/Home/Container';
import LastLessonCollection from './components/Sections/Lessons/LastCollection';
import Series from './components/Sections/Series/Container';
import LessonsSeriesCollection from './components/Sections/Series/Collection';
import ProjectStatus from './components/Sections/ProjectStatus/ProjectStatus';
// import Design from './components/Design/Design';
import * as ssrDataLoaders from './routesSSRData';

const NotImplemented = () => <h1>Not Implemented Yet</h1>;
const NotFound       = () => <h1>Page not found</h1>;
const Root           = ({ route }) => renderRoutes(route.routes);

/**
 * Creates a page route config
 *
 * @param {string} path
 * @param {React.Component|function} component
 * @param {object} subRoutes{array} prefix=''{string}
 */
const pageRoute = (path, component, { subRoutes, ssrData, prefix = '' } = {}) => ({
  exact: true,
  path: `${prefix}/${path}`,
  component,
  routes: subRoutes,
  ssrData,
});

/**
 * Creates a redirect route config
 *
 * @param {string} from
 * @param {string} to
 * @param {string} prefix='' will be prepended to both the 'from' and the 'to' params
 */
const redirect = (from, to, { prefix = '' }) => {
  const fullFrom = `${prefix}/${from}`;
  const fullTo   = `${prefix}/${to}`;
  return ({
    path: fullFrom,
    component: () => <Redirect to={fullTo} />
  });
};

const routes = [
  { path: '', component: HomePage, options: { ssrData: ssrDataLoaders.home } },
  { path: 'lessons', component: Lessons, options: { ssrData: ssrDataLoaders.cuListPage('lessons') } },
  { path: 'lessons/cu/:id', component: LessonUnit, options: { ssrData: ssrDataLoaders.cuPage } },
  { path: 'lessons/c/:id', component: LessonCollection, options: { ssrData: ssrDataLoaders.playlistCollectionPage } },
  { path: 'lessons/latest', component: LastLessonCollection, options: { ssrData: ssrDataLoaders.latestLesson } },
  { path: 'programs', component: Programs, options: { ssrData: ssrDataLoaders.cuListPage('programs') } },
  { path: 'programs/cu/:id', component: ProgramUnit, options: { ssrData: ssrDataLoaders.cuPage } },
  {
    path: 'programs/c/:id',
    component: ProgramCollection,
    options: { ssrData: ssrDataLoaders.collectionPage('programs-collection') }
  },
  { path: 'events', component: Events, options: { ssrData: ssrDataLoaders.eventsPage } },
  { path: 'events/:tab', component: Events, options: { ssrData: ssrDataLoaders.eventsPage } },
  { path: 'events/cu/:id', component: EventUnit, options: { ssrData: ssrDataLoaders.cuPage } },
  { path: 'events/c/:id', component: EventCollection, options: { ssrData: ssrDataLoaders.playlistCollectionPage } },
  { path: 'lectures', component: Lectures, options: { ssrData: ssrDataLoaders.lecturesPage } },
  { path: 'lectures/:tab', component: Lectures, options: { ssrData: ssrDataLoaders.lecturesPage } },
  { path: 'lectures/cu/:id', component: LectureUnit, options: { ssrData: ssrDataLoaders.cuPage } },
  {
    path: 'lectures/c/:id',
    component: LectureCollection,
    options: { ssrData: ssrDataLoaders.collectionPage('lectures-collection') }
  },
  { path: 'publications', component: Publications, options: { ssrData: ssrDataLoaders.cuListPage('publications') } },
  { path: 'publications/cu/:id', component: PublicationUnit, options: { ssrData: ssrDataLoaders.publicationCUPage } },
  {
    path: 'publications/c/:id',
    component: PublicationCollection,
    options: { ssrData: ssrDataLoaders.collectionPage('publications-collection') }
  },
  { path: 'sources', component: LibraryHomepage },
  { path: 'sources/:id', component: LibraryContainer, options: { ssrData: ssrDataLoaders.libraryPage } },
  { path: 'books', component: NotImplemented },
  { path: 'topics', component: NotImplemented },
  { path: 'photos', component: NotImplemented },
  { path: 'search', component: SearchResults, options: { ssrData: ssrDataLoaders.searchPage } },
  { path: 'series', component: Series, options: { ssrData: ssrDataLoaders.seriesPage } },
  {
    path: 'series/c/:id',
    component: LessonsSeriesCollection,
    options: { ssrData: ssrDataLoaders.playlistCollectionPage }
  },
  { path: 'project-status', component: ProjectStatus },
  // { path: 'design', component: Design },
  // { path: 'design2', component: Design2 },
];

const redirects = [
  { from: 'lessons/part/:id', to: 'lessons/cu/:id' },
  { from: 'lessons/full/:id', to: 'lessons/c/:id' },
  { from: 'programs/chapter/:id', to: 'programs/cu/:id' },
  { from: 'programs/full/:id', to: 'programs/c/:id' },
  { from: 'events/item/:id', to: 'events/cu/:id' },
  { from: 'events/full/:id', to: 'events/c/:id' },
];
const createMainRoutes = (prefix) => {
  const defaultPageOptions = { prefix };

  // for convenience
  const defaultPageRoute = (path, component, options = {}) =>
    pageRoute(path, component, { ...defaultPageOptions, ...options });

  // for convenience
  const defaultRedirect = (from, to) =>
    redirect(from, to, defaultPageOptions);

  return [{
    component: Layout,
    routes: [
      ...routes.map(route => defaultPageRoute(route.path, route.component, route.options)),

      // Old routes - redirect for now
      ...redirects.map(r => defaultRedirect(r.from, r.to)),

      {
        path: '*',
        component: NotFound
      }
    ]
  }];
};

/**
 * A component that sets the language it got from the route params.
 */
const RoutedLanguageSetter = ({ match, route }) => (
  <LanguageSetter language={match.params.language || route.defaultLanguage}>
    {renderRoutes(route.routes)}
  </LanguageSetter>
);

/**
 * Creates routes that would detect the language from the path and updates.
 *
 * @param {string} languagePathPrefix prefix path to detect a language with.
 * @param {function} routesCreator creates the routes that will be actually rendered
 */
const withLanguageRoutes = (languagePathPrefix, routesCreator = prefix => undefined) => ([
  {
    path: languagePathPrefix,
    component: RoutedLanguageSetter,
    routes: routesCreator(languagePathPrefix)
  }, {
    path: '',
    defaultLanguage: DEFAULT_LANGUAGE,
    component: RoutedLanguageSetter,
    routes: routesCreator('')
  }
]);

export default [
  {
    component: Root,
    routes: withLanguageRoutes('/:language([a-z]{2})', createMainRoutes)
  }
];
