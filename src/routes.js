import PropTypes from 'prop-types';
import React from 'react';
import { renderRoutes } from 'react-router-config';
import LanguageSetter from './components/Language/LanguageSetter';
import Layout from './components/Layout/Layout';
import NotImplemented from './components/NotImplemented';
import PlaylistCollectionIdCheck from './components/Pages/PlaylistCollection/IdCheck';
import PlaylistItemPage from './components/Pages/PlaylistItemPage';
import PlaylistDecorator from './components/Pages/PlaylistMy/Decorator';
import Events from './components/Sections/Events/MainPage';
import ExcerptContainer from './components/Sections/Excerpt/ExcerptContainer';
// import ProjectStatus from './components/Sections/ProjectStatus/ProjectStatus';
import Help from './components/Sections/Help/Help';
import HomePage from './components/Sections/Home/Container';
import LastLessonCollection from './components/Sections/Lesson/LastDaily';
import LessonCollection from './components/Sections/Lesson/LessonPage';
import Lessons from './components/Sections/Lessons/MainPage';
import LibraryHomepage from './components/Sections/Library/Homepage';
import LibraryContainer from './components/Sections/Library/LibraryContainer';
import LibraryPerson from './components/Sections/Library/LibraryPerson';
import Likut from './components/Sections/Likutim/Likut';
import LikutimMain from './components/Sections/Likutim/MainPage';
import Music from './components/Sections/Music/Music';
import BookmarksPage from './components/Sections/Personal/Bookmarks/Page';
import HistoryPage from './components/Sections/Personal/History/Page';
import Main from './components/Sections/Personal/Main/Page';
import PlaylistPage from './components/Sections/Personal/Playlist/Page';
import ReactionPage from './components/Sections/Personal/Reaction/Page';
import Program from './components/Sections/Program/ProgramPage';
import Programs from './components/Sections/Programs/MainPage';
import Sketches from './components/Sections/Sketches/MainPage';
import Publications from './components/Sections/Publications/MainPage';
import ArticleCollection from './components/Sections/Publications/tabs/Articles/Collection';
import ArticlePage from './components/Sections/Publications/tabs/Articles/Unit';
import BlogPost from './components/Sections/Publications/tabs/Blog/Post/Container';
import SimpleModeContainer from './components/Sections/SimpleMode/Container';
import Topics from './components/Sections/Topics/TopicContainer';
import Topic from './components/Sections/Topics/TopicPage';
import SearchResults from './components/Search/SearchResults';
import * as shapes from './components/shapes';
import {
  DEFAULT_LANGUAGE,
  MY_NAMESPACE_HISTORY,
  MY_NAMESPACE_REACTIONS,
  MY_NAMESPACE_PLAYLISTS,
  MY_NAMESPACE_BOOKMARKS,
  PAGE_NS_PROGRAMS
} from './helpers/consts';

// import Design from './components/Design/Design';
import * as ssrDataLoaders from './routesSSRData';

const routes = [
  { path: '', component: HomePage, options: { ssrData: ssrDataLoaders.home } },

  { path: 'personal', component: Main },
  { path: `personal/${MY_NAMESPACE_HISTORY}`, component: HistoryPage },
  { path: `personal/${MY_NAMESPACE_REACTIONS}`, component: ReactionPage },
  { path: `personal/${MY_NAMESPACE_PLAYLISTS}/:id`, component: PlaylistPage },
  { path: `${MY_NAMESPACE_PLAYLISTS}/:id`, component: PlaylistDecorator },
  { path: `${MY_NAMESPACE_BOOKMARKS}`, component: BookmarksPage },

  { path: 'publications', component: Publications, options: { ssrData: ssrDataLoaders.publicationsPage } },
  { path: 'publications/:tab', component: Publications, options: { ssrData: ssrDataLoaders.publicationsPage } },
  { path: 'publications/articles/cu/:id', component: ArticlePage, options: { ssrData: ssrDataLoaders.articleCUPage } },
  {
    path: 'publications/articles/c/:id',
    component: ArticleCollection,
    options: { ssrData: ssrDataLoaders.collectionPage('publications-collection') }
  },
  { path: 'publications/blog/:blog/:id', component: BlogPost, options: { ssrData: ssrDataLoaders.blogPostPage } },

  { path: ':routeType/cu/:id', component: PlaylistItemPage, options: { ssrData: ssrDataLoaders.cuPage } },
  { path: 'lessons', component: Lessons, options: { ssrData: ssrDataLoaders.lessonsPage } },
  { path: 'lessons/:tab', component: Lessons, options: { ssrData: ssrDataLoaders.lessonsPage } },
  {
    path: 'lessons/virtual/c/:id',
    component: LessonCollection,
    options: { ssrData: ssrDataLoaders.lessonsCollectionPage }
  },
  {
    path: 'lessons/:tab/c/:id',
    component: PlaylistCollectionIdCheck,
    options: { ssrData: ssrDataLoaders.lessonsCollectionPage }
  },
  { path: ':routeType/:tab/cu/:id', component: PlaylistItemPage, options: { ssrData: ssrDataLoaders.cuPage } },
  { path: 'lessons/daily/latest', component: LastLessonCollection, options: { ssrData: ssrDataLoaders.latestLesson } },
  { path: 'programs', component: Programs, options: { ssrData: ssrDataLoaders.programsPage } },
  { path: 'programs/:tab', component: Programs, options: { ssrData: ssrDataLoaders.programsPage } },
  {
    path: 'programs/c/:id',
    component: Program,
    options: { ssrData: ssrDataLoaders.collectionPage(PAGE_NS_PROGRAMS) }
  },
  { path: 'events', component: Events, options: { ssrData: ssrDataLoaders.eventsPage } },
  {
    path: 'events/c/:id',
    component: PlaylistCollectionIdCheck,
    options: { ssrData: ssrDataLoaders.playlistCollectionPage }
  },
  { path: 'music', component: Music, options: { ssrData: ssrDataLoaders.musicPage } },
  {
    path: 'music/c/:id',
    component: PlaylistCollectionIdCheck,
    options: { ssrData: ssrDataLoaders.playlistCollectionPage }
  },
  { path: 'sources', component: LibraryHomepage },
  { path: 'sources/:id', component: LibraryContainer, options: { ssrData: ssrDataLoaders.libraryPage } },
  { path: 'topics', component: Topics },
  { path: 'topics/:id', component: Topic, options: { ssrData: ssrDataLoaders.topicsPage } },
  { path: 'persons/:id', component: LibraryPerson, options: { ssrData: ssrDataLoaders.libraryPage } },
  { path: 'books', component: NotImplemented },
  { path: 'photos', component: NotImplemented },
  { path: 'search', component: SearchResults, options: { ssrData: ssrDataLoaders.searchPage } },
  // { path: 'project-status', component: ProjectStatus },
  { path: 'help', component: Help },
  { path: 'simple-mode', component: SimpleModeContainer, options: { ssrData: ssrDataLoaders.simpleMode } },
  { path: 'excerpt', component: ExcerptContainer },
  { path: 'likutim', component: LikutimMain },
  { path: 'likutim/:id', component: Likut, },
  { path: 'sketches', component: Sketches, options: { ssrData: ssrDataLoaders.programsPage } },
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
const routesCreator = prefix => {
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
const RoutedLanguageSetter = ({ match, route }) =>
  <LanguageSetter language={match.params.language}>
    {renderRoutes(route.routes)}
  </LanguageSetter>;

const RouteItem = PropTypes.shape({
  component: PropTypes.elementType.isRequired,
  exact: PropTypes.bool,
  path: PropTypes.string.isRequired,
  ssrData: PropTypes.func,
});

RoutedLanguageSetter.propTypes = {
  match: shapes.RouterMatch.isRequired,
  route: PropTypes.shape({
    component: PropTypes.elementType.isRequired,
    path: PropTypes.string.isRequired,
    routes: PropTypes.arrayOf(PropTypes.shape({
      component: PropTypes.object.isRequired,
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

withLanguageRoutes.propTypes = {
  languagePathPrefix: PropTypes.string.isRequired,
  creator: PropTypes.func.isRequired,
};

const exportArr = [
  {
    component: Root,
    routes: withLanguageRoutes('/:language([a-z]{2})', routesCreator)
  }
];

export default exportArr;
