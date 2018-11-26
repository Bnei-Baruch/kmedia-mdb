/* eslint-disable react/no-multi-comp */

import React from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';
import Loadable from 'react-loadable';

import { DEFAULT_LANGUAGE } from './helpers/consts';
import LanguageSetter from './components/Language/LanguageSetter';
import Layout from './components/Layout/Layout';
import Loading from './components/shared/Loading';
import * as ssrDataLoaders from './routesSSRData';
import * as shapes from './components/shapes';

const l = f => ({
  loader: f,
  loading: Loading,
  delay: 200,
  timeout: 5000,
});

const HomePage             = Loadable(l(() => import('./components/Sections/Home/Container')));
const Lessons              = Loadable(l(() => import('./components/Sections/Lessons/MainPage')));
const LessonUnit           = Loadable(l(() => import('./components/Sections/Lessons/Unit/Container')));
const LessonCollection     = Loadable(l(() => import('./components/Sections/Lessons/Collection/MainPage')));
const LastLessonCollection = Loadable(l(() => import('./components/Sections/Lessons/Collection/LastDaily')));
const Programs             = Loadable(l(() => import('./components/Sections/Programs/MainPage')));
const ProgramUnit          = Loadable(l(() => import('./components/Sections/Programs/Unit')));
const ProgramCollection    = Loadable(l(() => import('./components/Sections/Programs/Collection')));
const Publications         = Loadable(l(() => import('./components/Sections/Publications/MainPage')));
const ArticleUnit          = Loadable(l(() => import('./components/Sections/Publications/tabs/Articles/Unit')));
const ArticleCollection    = Loadable(l(() => import('./components/Sections/Publications/tabs/Articles/Collection')));
const BlogPost             = Loadable(l(() => import('./components/Sections/Publications/tabs/Blog/Post/Container')));
const Events               = Loadable(l(() => import('./components/Sections/Events/MainPage')));
const EventUnit            = Loadable(l(() => import('./components/Sections/Events/Unit')));
const EventCollection      = Loadable(l(() => import('./components/Sections/Events/Collection')));
const LibraryHomepage      = Loadable(l(() => import('./components/Sections/Library/Homepage')));
const LibraryContainer     = Loadable(l(() => import('./components/Sections/Library/LibraryContainer')));
const LibraryPerson        = Loadable(l(() => import('./components/Sections/Library/LibraryPerson')));
const Topics               = Loadable(l(() => import('./components/Sections/Topics/TopicContainer')));
const Topic                = Loadable(l(() => import('./components/Sections/Topics/TopicPage')));
const SearchResults        = Loadable(l(() => import('./components/Search/SearchResultsContainer')));
const ProjectStatus        = Loadable(l(() => import('./components/Sections/ProjectStatus/ProjectStatus')));
const Help                 = Loadable(l(() => import('./components/Sections/Help/Help')));
const SimpleMode           = Loadable(l(() => import('./components/Sections/SimpleMode/Container')));
const NotImplemented       = Loadable(l(() => import('./components/NotImplemented')));
// const Design = Loadable(l(() => import('./components/Design/Design')));
// const Design2 = Loadable(l(() => import('./components/Design/Design2')));

const routes = [
  { path: '', component: HomePage, options: { ssrData: ssrDataLoaders.home } },
  { path: 'lessons', component: Lessons, options: { ssrData: ssrDataLoaders.lessonsPage } },
  { path: 'lessons/:tab', component: Lessons, options: { ssrData: ssrDataLoaders.lessonsPage } },
  {
    path: 'lessons/:tab/c/:id',
    component: LessonCollection,
    options: { ssrData: ssrDataLoaders.lessonsCollectionPage }
  },
  { path: 'lessons/cu/:id', component: LessonUnit, options: { ssrData: ssrDataLoaders.cuPage } },
  { path: 'lessons/daily/latest', component: LastLessonCollection, options: { ssrData: ssrDataLoaders.latestLesson } },
  { path: 'programs', component: Programs, options: { ssrData: ssrDataLoaders.programsPage } },
  { path: 'programs/:tab', component: Programs, options: { ssrData: ssrDataLoaders.programsPage } },
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
  { path: 'publications', component: Publications, options: { ssrData: ssrDataLoaders.publicationsPage } },
  { path: 'publications/:tab', component: Publications, options: { ssrData: ssrDataLoaders.publicationsPage } },
  { path: 'publications/articles/cu/:id', component: ArticleUnit, options: { ssrData: ssrDataLoaders.articleCUPage } },
  {
    path: 'publications/articles/c/:id',
    component: ArticleCollection,
    options: { ssrData: ssrDataLoaders.collectionPage('publications-collection') }
  },
  { path: 'publications/blog/:blog/:id', component: BlogPost, options: { ssrData: ssrDataLoaders.blogPostPage } },
  { path: 'sources', component: LibraryHomepage },
  { path: 'sources/:id', component: LibraryContainer, options: { ssrData: ssrDataLoaders.libraryPage } },
  { path: 'topics', component: Topics },
  { path: 'topics/:id', component: Topic, options: { ssrData: ssrDataLoaders.topicsPage } },
  { path: 'persons/:id', component: LibraryPerson, options: { ssrData: ssrDataLoaders.libraryPage } },
  { path: 'books', component: NotImplemented },
  { path: 'photos', component: NotImplemented },
  { path: 'search', component: SearchResults, options: { ssrData: ssrDataLoaders.searchPage } },
  { path: 'project-status', component: ProjectStatus },
  { path: 'help', component: Help },
  { path: 'simple-mode', component: SimpleMode, options: { ssrData: ssrDataLoaders.simpleMode } },
  // { path: 'design', component: Design },
  // { path: 'design2', component: Design2 },
];

const NotFound = () => <h1>Page not found</h1>;
const Root     = ({ route }) => renderRoutes(route.routes);

/** Creates a page route config */
const pageRoute = (path, component, { prefix, subRoutes, ssrData } = {}) => ({
  exact: true,
  path: `${prefix}/${path}`,
  component,
  routes: subRoutes,
  ssrData,
});

pageRoute.propTypes    = {
  path: PropTypes.string.isRequired,
  component: PropTypes.func.isRequired,
  subRoutes: PropTypes.arrayOf(PropTypes.string),
  ssrData: PropTypes.func.isRequired,
  prefix: PropTypes.string,
};
pageRoute.defaultProps = {
  prefix: '',
  subRoutes: null,
};

/** Creates a page route */
const routesCreator = (prefix) => {
  const makePageRoute = (path, component, options = {}) => pageRoute(path, component, { prefix, ...options });

  return [{
    component: Layout,
    routes: [
      ...routes.map(({ path, component, options }) => makePageRoute(path, component, options)),

      {
        path: '*',
        component: NotFound
      }
    ]
  }];
};

routesCreator.propTypes = {
  prefix: PropTypes.string.isRequired,
};

/** A component that sets the language it got from the route params. */
const RoutedLanguageSetter = ({ match, route }) => (
  <LanguageSetter language={match.params.language || route.defaultLanguage}>
    {renderRoutes(route.routes)}
  </LanguageSetter>
);

const RouteItem = PropTypes.shape({
  component: PropTypes.func.isRequired,
  exact: PropTypes.bool,
  path: PropTypes.string.isRequired,
  ssrData: PropTypes.func,
});

RoutedLanguageSetter.propTypes = {
  match: shapes.RouterMatch.isRequired,
  route: PropTypes.shape({
    component: PropTypes.func.isRequired,
    path: PropTypes.string.isRequired,
    routes: PropTypes.arrayOf(PropTypes.shape({
      component: PropTypes.func.isRequired,
      routes: PropTypes.arrayOf(RouteItem),
    })),
  }).isRequired,
};

/** Creates routes that would detect the language from the path and updates. */
const withLanguageRoutes = (languagePathPrefix, creator) => ([
  {
    path: languagePathPrefix,
    component: RoutedLanguageSetter,
    routes: creator(languagePathPrefix)
  }, {
    path: '',
    defaultLanguage: DEFAULT_LANGUAGE,
    component: RoutedLanguageSetter,
    routes: creator('')
  }
]);

withLanguageRoutes.propTypes    = {
  languagePathPrefix: PropTypes.string.isRequired,
  creator: PropTypes.func,
};
withLanguageRoutes.defaultProps = {
  creator: () => undefined,
};

export default [
  {
    component: Root,
    routes: withLanguageRoutes('/:language([a-z]{2})', routesCreator)
  }
];
