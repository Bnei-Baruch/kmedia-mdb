import { lazy } from 'react';
import { matchRoutes } from 'react-router-dom';
import {
  MY_NAMESPACE_BOOKMARKS,
  MY_NAMESPACE_HISTORY,
  MY_NAMESPACE_PLAYLISTS,
  MY_NAMESPACE_REACTIONS,
  PAGE_NS_PROGRAMS
} from '../helpers/consts';
import * as ssrDataLoaders from './routesSSRData';

const d = path => mod => ({ default: mod[path] });

// lazy() that can be loaded ahead of rendering. The client preloads the current route's chunk before
// hydrateRoot (see preloadRoute): otherwise the route suspends while hydrating, any store update before its chunk
// arrives makes React drop the server HTML for the Suspense fallback (null), and the page blanks and re-renders —
// a layout shift on every page load. Once preloaded, the component renders synchronously; a lazy component adds
// no DOM, so the server markup (rendered through lazy) still matches.
const lazyPreload = factory => {
  const Lazy = lazy(factory);
  let Loaded = null;
  const Component = props => (Loaded ? <Loaded {...props}/> : <Lazy {...props}/>);
  Component.preload = () => factory().then(mod => {
    Loaded = mod.default;
    return mod;
  });
  return Component;
};

const PlaylistCollectionPage  = lazyPreload(() => import('../components/Pages/WithPlayer/PlaylistPageDispecher').then(d('PlaylistCollectionPage')));
const PlaylistItemPageEvent   = lazyPreload(() => import('../components/Pages/WithPlayer/PlaylistPageDispecher').then(d('PlaylistItemPageEvent')));
const PlaylistItemPageLesson  = lazyPreload(() => import('../components/Pages/WithPlayer/PlaylistPageDispecher').then(d('PlaylistItemPageLesson')));
const PlaylistItemPageProgram = lazyPreload(() => import('../components/Pages/WithPlayer/PlaylistPageDispecher').then(d('PlaylistItemPageProgram')));
const PlaylistItemPageSeries  = lazyPreload(() => import('../components/Pages/WithPlayer/PlaylistPageDispecher').then(d('PlaylistItemPageSeries')));
const PlaylistItemPageVirtual = lazyPreload(() => import('../components/Pages/WithPlayer/PlaylistPageDispecher').then(d('PlaylistItemPageVirtual')));

const SourceContainer     = lazyPreload(() => import('../components/Sections/Source/SourceContainer'));
const LibraryHomepage     = lazyPreload(() => import('../components/Sections/Sources/Homepage'));
const LibraryPerson       = lazyPreload(() => import('../components/Sections/Sources/LibraryPerson'));
const PlaylistLastDaily   = lazyPreload(() => import('../components/Pages/WithPlayer/LastDaily/PlaylistLastDaily'));
const SearchResults       = lazyPreload(() => import('../components/Search/SearchResults'));
const Events              = lazyPreload(() => import('../components/Sections/Events/MainPage'));
const ExcerptContainer    = lazyPreload(() => import('../components/Sections/Excerpt/ExcerptContainer'));
const Help                = lazyPreload(() => import('../components/Sections/Help/Help'));
const HomePage            = lazyPreload(() => import('../components/Sections/Home/Container'));
const LessonCollection    = lazyPreload(() => import('../components/Sections/Lesson/LessonPage'));
const Lessons             = lazyPreload(() => import('../components/Sections/Lessons/MainPage'));
const Likut               = lazyPreload(() => import('../components/Sections/Likutim/Likut'));
const LikutimMain         = lazyPreload(() => import('../components/Sections/Likutim/MainPage'));
const Music               = lazyPreload(() => import('../components/Sections/Music/Music'));
const BookmarksPage       = lazyPreload(() => import('../components/Sections/Personal/Bookmarks/Page'));
const HistoryPage         = lazyPreload(() => import('../components/Sections/Personal/History/Page'));
const Main                = lazyPreload(() => import('../components/Sections/Personal/Main/Page'));
const PlaylistPage        = lazyPreload(() => import('../components/Sections/Personal/Playlist/Page'));
const ReactionPage        = lazyPreload(() => import('../components/Sections/Personal/Reaction/Page'));
const Program             = lazyPreload(() => import('../components/Sections/Program/ProgramPage'));
const Programs            = lazyPreload(() => import('../components/Sections/Programs/MainPage'));
const Publications        = lazyPreload(() => import('../components/Sections/Publications/MainPage'));
const ArticleCollection   = lazyPreload(() => import('../components/Sections/Publications/tabs/Articles/Collection'));
const ArticlePage         = lazyPreload(() => import('../components/Sections/Publications/tabs/Articles/ArticlePage'));
const BlogPost            = lazyPreload(() => import('../components/Sections/Publications/tabs/Blog/Post/Container'));
const SimpleModeContainer = lazyPreload(() => import('../components/Sections/SimpleMode/Container'));
const Sketches            = lazyPreload(() => import('../components/Sections/Sketches/MainPage'));
const Topics              = lazyPreload(() => import('../components/Sections/Topics/TopicContainer'));
const Topic               = lazyPreload(() => import('../components/Sections/Topics/TopicPage'));
const AboutPage           = lazyPreload(() => import('../components/Sections/About/AboutPage'));
const PlaylistMy          = lazyPreload(() => import('../components/Pages/WithPlayer/PlaylistMy/Container'));
const PageNotFound        = lazyPreload(() => import('../components/shared/PageNotFound'));

const buildRoutes = playerContainer => ([
  { path: '', component: <HomePage/>, ssrData: ssrDataLoaders.home },

  { path: 'personal', component: <Main/> },
  { path: `personal/${MY_NAMESPACE_HISTORY}`, component: <HistoryPage/> },
  { path: `personal/${MY_NAMESPACE_REACTIONS}`, component: <ReactionPage/> },
  { path: `personal/${MY_NAMESPACE_PLAYLISTS}/:id`, component: <PlaylistPage/> },
  { path: `${MY_NAMESPACE_PLAYLISTS}/:id`, component: <PlaylistMy playerContainer={playerContainer}/> },
  { path: `${MY_NAMESPACE_BOOKMARKS}`, component: <BookmarksPage/> },

  { path: 'publications', component: <Publications/>, ssrData: ssrDataLoaders.publicationsPage },
  { path: 'publications/:tab', component: <Publications/>, ssrData: ssrDataLoaders.publicationsPage },
  { path: 'publications/articles/cu/:id', component: <ArticlePage/>, ssrData: ssrDataLoaders.articleCUPage },
  {
    path     : 'publications/articles/c/:id',
    component: <ArticleCollection/>,
    ssrData  : ssrDataLoaders.collectionPage('publications-collection')
  },
  { path: 'publications/blog/:blog/:id', component: <BlogPost/>, ssrData: ssrDataLoaders.blogPostPage },

  { path: 'lessons', component: <Lessons/>, ssrData: ssrDataLoaders.lessonsPage },
  { path: 'lessons/:tab', component: <Lessons/>, ssrData: ssrDataLoaders.lessonsPage },
  { path: 'lessons/virtual/c/:id', component: <LessonCollection/>, ssrData: ssrDataLoaders.lessonsCollectionPage },
  {
    path     : 'lessons/virtual/cu/:id',
    component: <PlaylistItemPageVirtual playerContainer={playerContainer}/>,
    ssrData  : ssrDataLoaders.cuPage
  },
  {
    path     : 'lessons/:tab/c/:id',
    component: <PlaylistCollectionPage playerContainer={playerContainer}/>,
    ssrData  : ssrDataLoaders.lessonsCollectionPage
  },
  {
    path     : 'lessons/cu/:id',
    component: <PlaylistItemPageLesson playerContainer={playerContainer}/>,
    ssrData  : ssrDataLoaders.cuPage
  },
  {
    path     : 'lessons/series/cu/:id',
    component: <PlaylistItemPageSeries playerContainer={playerContainer}/>,
    ssrData  : ssrDataLoaders.cuPage
  },
  {
    path     : 'lessons/:tab/cu/:id',
    component: <PlaylistItemPageLesson playerContainer={playerContainer}/>,
    ssrData  : ssrDataLoaders.cuPage
  },
  {
    path     : 'lessons/daily/latest',
    component: <PlaylistLastDaily playerContainer={playerContainer}/>,
    ssrData  : ssrDataLoaders.latestLesson
  },
  { path: 'programs', component: <Programs/>, ssrData: ssrDataLoaders.programsPage },
  { path: 'programs/:tab', component: <Programs/>, ssrData: ssrDataLoaders.programsPage },
  {
    path     : 'programs/c/:id',
    component: <Program/>,
    ssrData  : ssrDataLoaders.collectionPage(PAGE_NS_PROGRAMS)
  },
  {
    path     : 'programs/cu/:id',
    component: <PlaylistItemPageProgram playerContainer={playerContainer}/>,
    ssrData  : ssrDataLoaders.cuPage
  },
  {
    path     : 'programs/:tab/cu/:id',
    component: <PlaylistItemPageProgram playerContainer={playerContainer}/>,
    ssrData  : ssrDataLoaders.cuPage
  },

  { path: 'events', component: <Events/>, ssrData: ssrDataLoaders.eventsPage },
  {
    path     : 'events/c/:id',
    component: <PlaylistCollectionPage playerContainer={playerContainer}/>,
    ssrData  : ssrDataLoaders.playlistCollectionPage
  },
  {
    path     : 'events/cu/:id',
    component: <PlaylistItemPageEvent playerContainer={playerContainer}/>,
    ssrData  : ssrDataLoaders.cuPage
  },
  {
    path     : 'events/:tab/cu/:id',
    component: <PlaylistItemPageEvent playerContainer={playerContainer}/>,
    ssrData  : ssrDataLoaders.cuPage
  },

  { path: 'music', component: <Music/>, ssrData: ssrDataLoaders.musicPage },
  {
    path     : 'music/c/:id',
    component: <PlaylistCollectionPage playerContainer={playerContainer}/>,
    ssrData  : ssrDataLoaders.playlistCollectionPage
  },
  {
    path     : 'music/:id/cu/:cuId',
    component: <PlaylistCollectionPage playerContainer={playerContainer}/>,
    ssrData  : ssrDataLoaders.playlistCollectionPage
  },

  { path: 'sources', component: <LibraryHomepage/> },
  { path: 'sources/:id', component: <SourceContainer/>, ssrData: ssrDataLoaders.libraryPage },
  { path: 'topics', component: <Topics/> },
  { path: 'topics/:id', component: <Topic/>, ssrData: ssrDataLoaders.topicsPage },
  { path: 'persons/:id', component: <LibraryPerson/>, ssrData: ssrDataLoaders.personPage },
  { path: 'search', component: <SearchResults/>, ssrData: ssrDataLoaders.searchPage },
  { path: 'help', component: <Help/> },
  { path: 'simple-mode', component: <SimpleModeContainer/>, ssrData: ssrDataLoaders.simpleMode },
  { path: 'excerpt', component: <ExcerptContainer/> },
  { path: 'likutim', component: <LikutimMain/> },
  { path: 'likutim/:id', component: <Likut/>, ssrData: ssrDataLoaders.likutPage },
  { path: 'sketches', component: <Sketches/>, ssrData: ssrDataLoaders.programsPage },
  { path: 'about', component: <AboutPage/>, ssrData: ssrDataLoaders.aboutPage },
  // must stay last: the server answers 404 when only this route matches (server/rendererUtils.jsx)
  { path: '*', component: <PageNotFound/>, notFound: true },
]);

// Load the chunk of the route matching `pathname` (/:lang/…) — call before hydrating.
export const preloadRoute = pathname => {
  const routes  = [{ path: '/:lang', children: buildRoutes(null) }];
  const matches = matchRoutes(routes, pathname) || [];
  const preload = matches[matches.length - 1]?.route.component?.type?.preload;
  return preload ? preload() : Promise.resolve();
};

export default buildRoutes;
