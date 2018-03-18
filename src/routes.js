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
import Lectures from './components/Sections/Lectures/List';
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
      defaultPageRoute('', HomePage, { ssrData: ssrDataLoaders.home }),
      defaultPageRoute('lessons', Lessons, { ssrData: ssrDataLoaders.cuListPage('lessons') }),
      defaultPageRoute('lessons/cu/:id', LessonUnit, { ssrData: ssrDataLoaders.cuPage }),
      defaultPageRoute('lessons/c/:id', LessonCollection, { ssrData: ssrDataLoaders.playlistCollectionPage }),
      defaultPageRoute('lessons/latest', LastLessonCollection, { ssrData: ssrDataLoaders.latestLesson }),
      defaultPageRoute('programs', Programs, { ssrData: ssrDataLoaders.cuListPage('programs') }),
      defaultPageRoute('programs/cu/:id', ProgramUnit, { ssrData: ssrDataLoaders.cuPage }),
      defaultPageRoute('programs/c/:id', ProgramCollection, { ssrData: ssrDataLoaders.collectionPage('programs-collection') }),
      defaultPageRoute('events', Events, { ssrData: ssrDataLoaders.eventsPage }),
      defaultPageRoute('events/:tab', Events, { ssrData: ssrDataLoaders.eventsPage }),
      defaultPageRoute('events/cu/:id', EventUnit, { ssrData: ssrDataLoaders.cuPage }),
      defaultPageRoute('events/c/:id', EventCollection, { ssrData: ssrDataLoaders.playlistCollectionPage }),
      defaultPageRoute('lectures', Lectures, { ssrData: ssrDataLoaders.cuListPage('lectures') }),
      defaultPageRoute('lectures/cu/:id', LectureUnit, { ssrData: ssrDataLoaders.cuPage }),
      defaultPageRoute('lectures/c/:id', LectureCollection, { ssrData: ssrDataLoaders.collectionPage('lectures-collection') }),
      defaultPageRoute('publications', Publications, { ssrData: ssrDataLoaders.cuListPage('publications') }),
      defaultPageRoute('publications/cu/:id', PublicationUnit),
      defaultPageRoute('publications/c/:id', PublicationCollection, { ssrData: ssrDataLoaders.collectionPage('publications-collection') }),
      defaultPageRoute('sources', LibraryHomepage),
      defaultPageRoute('sources/:id', LibraryContainer, { ssrData: ssrDataLoaders.libraryPage }),
      defaultPageRoute('books', NotImplemented),
      defaultPageRoute('topics', NotImplemented),
      defaultPageRoute('photos', NotImplemented),
      defaultPageRoute('search', SearchResults, { ssrData: ssrDataLoaders.searchPage }),
      // defaultPageRoute('design', Design),
      // defaultPageRoute('design2', Lessons),

      // Old routes - redirect for now
      defaultRedirect('lessons/part/:id', 'lessons/cu/:id'),
      defaultRedirect('lessons/full/:id', 'lessons/c/:id'),
      defaultRedirect('programs/chapter/:id', 'programs/cu/:id'),
      defaultRedirect('programs/full/:id', 'programs/c/:id'),
      defaultRedirect('events/item/:id', 'events/cu/:id'),
      defaultRedirect('events/full/:id', 'events/c/:id'),
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
