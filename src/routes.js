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

const l = (f, name) => ({
  loader: f,
  loading: Loading,
  modules: [name],
  delay: 200,
  timeout: 5000,
});

const HomePage             = Loadable(l(() => import(/* webpackChunkName: "HomeContainer" */ './components/Sections/Home/Container'), 'HomeContainer'));
const Lessons              = Loadable(l(() => import(/* webpackChunkName: "LessonsMainPage" */ './components/Sections/Lessons/MainPage'), 'LessonsMainPage'));
const LessonUnit           = Loadable(l(() => import(/* webpackChunkName: "LessonsUnitContainer" */ './components/Sections/Lessons/Unit/Container'), 'LessonsUnitContainer'));
const LessonCollection     = Loadable(l(() => import(/* webpackChunkName: "LessonsCollectionMainPage" */ './components/Sections/Lessons/Collection/MainPage'), 'LessonsCollectionMainPage'));
const LastLessonCollection = Loadable(l(() => import(/* webpackChunkName: "LessonsCollectionLastDaily" */ './components/Sections/Lessons/Collection/LastDaily'), 'LessonsCollectionLastDaily'));
const Programs             = Loadable(l(() => import(/* webpackChunkName: "ProgramsMainPage" */ './components/Sections/Programs/MainPage'), 'ProgramsMainPage'));
const ProgramUnit          = Loadable(l(() => import(/* webpackChunkName: "ProgramsUnit" */ './components/Sections/Programs/Unit'), 'ProgramsUnit'));
const ProgramCollection    = Loadable(l(() => import(/* webpackChunkName: "ProgramsCollection" */ './components/Sections/Programs/Collection'), 'ProgramsCollection'));
const Publications         = Loadable(l(() => import(/* webpackChunkName: "PublicationsMainPage" */ './components/Sections/Publications/MainPage'), 'PublicationsMainPage'));
const ArticleUnit          = Loadable(l(() => import(/* webpackChunkName: "PublicationstabsArticlesUnit" */ './components/Sections/Publications/tabs/Articles/Unit'), 'PublicationstabsArticlesUnit'));
const ArticleCollection    = Loadable(l(() => import(/* webpackChunkName: "PublicationstabsArticlesCollection" */ './components/Sections/Publications/tabs/Articles/Collection'), 'PublicationstabsArticlesCollection'));
const BlogPost             = Loadable(l(() => import(/* webpackChunkName: "PublicationstabsBlogPostContainer" */ './components/Sections/Publications/tabs/Blog/Post/Container'), 'PublicationstabsBlogPostContainer'));
const Events               = Loadable(l(() => import(/* webpackChunkName: "EventsMainPage" */ './components/Sections/Events/MainPage'), 'EventsMainPage'));
const EventUnit            = Loadable(l(() => import(/* webpackChunkName: "EventsUnit" */ './components/Sections/Events/Unit'), 'EventsUnit'));
const EventCollection      = Loadable(l(() => import(/* webpackChunkName: "EventsCollection" */ './components/Sections/Events/Collection'), 'EventsCollection'));
const LibraryHomepage      = Loadable(l(() => import(/* webpackChunkName: "LibraryHomepage" */ './components/Sections/Library/Homepage'), 'LibraryHomepage'));
const LibraryContainer     = Loadable(l(() => import(/* webpackChunkName: "LibraryLibraryContainer" */ './components/Sections/Library/LibraryContainer'), 'LibraryLibraryContainer'));
const LibraryPerson        = Loadable(l(() => import(/* webpackChunkName: "LibraryLibraryPerson" */ './components/Sections/Library/LibraryPerson'), 'LibraryLibraryPerson'));
const Topics               = Loadable(l(() => import(/* webpackChunkName: "TopicsTopicContainer" */ './components/Sections/Topics/TopicContainer'), 'TopicsTopicContainer'));
const Topic                = Loadable(l(() => import(/* webpackChunkName: "TopicsTopicPage" */ './components/Sections/Topics/TopicPage'), 'TopicsTopicPage'));
const SearchResults        = Loadable(l(() => import(/* webpackChunkName: "archResultsContainer" */ './components/Search/SearchResultsContainer'), 'SearchSearchResultsContainer'));
const ProjectStatus        = Loadable(l(() => import(/* webpackChunkName: "ProjectStatusProjectStatus" */ './components/Sections/ProjectStatus/ProjectStatus'), 'ProjectStatusProjectStatus'));
const Help                 = Loadable(l(() => import(/* webpackChunkName: "HelpHelp" */ './components/Sections/Help/Help'), 'HelpHelp'));
const SimpleMode           = Loadable(l(() => import(/* webpackChunkName: "SimpleModeContainer" */ './components/Sections/SimpleMode/Container'), 'SimpleModeContainer'));
const NotImplemented       = Loadable(l(() => import(/* webpackChunkName: "NotImplemented" */ './components/NotImplemented'), 'NotImplemented'));
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
