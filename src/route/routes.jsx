import { lazy } from 'react';
import {
  MY_NAMESPACE_BOOKMARKS,
  MY_NAMESPACE_HISTORY,
  MY_NAMESPACE_PLAYLISTS,
  MY_NAMESPACE_REACTIONS,
  PAGE_NS_PROGRAMS
} from '../helpers/consts';
import * as ssrDataLoaders from './routesSSRData';

const d = path => mod => ({ default: mod[path] });

const PlaylistCollectionPage  = lazy(() => import('../components/Pages/WithPlayer/PlaylistPageDispecher').then(d('PlaylistCollectionPage')));
const PlaylistItemPageEvent   = lazy(() => import('../components/Pages/WithPlayer/PlaylistPageDispecher').then(d('PlaylistItemPageEvent')));
const PlaylistItemPageLesson  = lazy(() => import('../components/Pages/WithPlayer/PlaylistPageDispecher').then(d('PlaylistItemPageLesson')));
const PlaylistItemPageProgram = lazy(() => import('../components/Pages/WithPlayer/PlaylistPageDispecher').then(d('PlaylistItemPageProgram')));
const PlaylistItemPageSeries  = lazy(() => import('../components/Pages/WithPlayer/PlaylistPageDispecher').then(d('PlaylistItemPageSeries')));
const PlaylistItemPageVirtual = lazy(() => import('../components/Pages/WithPlayer/PlaylistPageDispecher').then(d('PlaylistItemPageVirtual')));

const SourceContainer     = lazy(() => import('../components/Sections/Source/SourceContainer'));
const LibraryHomepage     = lazy(() => import('../components/Sections/Sources/Homepage'));
const LibraryPerson       = lazy(() => import('../components/Sections/Sources/LibraryPerson'));
const PlaylistLastDaily   = lazy(() => import('../components/Pages/WithPlayer/LastDaily/PlaylistLastDaily'));
const SearchResults       = lazy(() => import('../components/Search/SearchResults'));
const Events              = lazy(() => import('../components/Sections/Events/MainPage'));
const ExcerptContainer    = lazy(() => import('../components/Sections/Excerpt/ExcerptContainer'));
const Help                = lazy(() => import('../components/Sections/Help/Help'));
const HomePage            = lazy(() => import('../components/Sections/Home/Container'));
const LessonCollection    = lazy(() => import('../components/Sections/Lesson/LessonPage'));
const Lessons             = lazy(() => import('../components/Sections/Lessons/MainPage'));
const Likut               = lazy(() => import('../components/Sections/Likutim/Likut'));
const LikutimMain         = lazy(() => import('../components/Sections/Likutim/MainPage'));
const Music               = lazy(() => import('../components/Sections/Music/Music'));
const BookmarksPage       = lazy(() => import('../components/Sections/Personal/Bookmarks/Page'));
const HistoryPage         = lazy(() => import('../components/Sections/Personal/History/Page'));
const Main                = lazy(() => import('../components/Sections/Personal/Main/Page'));
const PlaylistPage        = lazy(() => import('../components/Sections/Personal/Playlist/Page'));
const ReactionPage        = lazy(() => import('../components/Sections/Personal/Reaction/Page'));
const Program             = lazy(() => import('../components/Sections/Program/ProgramPage'));
const Programs            = lazy(() => import('../components/Sections/Programs/MainPage'));
const Publications        = lazy(() => import('../components/Sections/Publications/MainPage'));
const ArticleCollection   = lazy(() => import('../components/Sections/Publications/tabs/Articles/Collection'));
const ArticlePage         = lazy(() => import('../components/Sections/Publications/tabs/Articles/Unit'));
const BlogPost            = lazy(() => import('../components/Sections/Publications/tabs/Blog/Post/Container'));
const SimpleModeContainer = lazy(() => import('../components/Sections/SimpleMode/Container'));
const Sketches            = lazy(() => import('../components/Sections/Sketches/MainPage'));
const Topics              = lazy(() => import('../components/Sections/Topics/TopicContainer'));
const Topic               = lazy(() => import('../components/Sections/Topics/TopicPage'));
const AboutPage           = lazy(() => import('../components/Sections/About/AboutPage'));
const PlaylistMy          = lazy(() => import('../components/Pages/WithPlayer/PlaylistMy/Container'));

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
  { path: 'persons/:id', component: <LibraryPerson/>, ssrData: ssrDataLoaders.libraryPage },
  { path: 'search', component: <SearchResults/>, ssrData: ssrDataLoaders.searchPage },
  { path: 'help', component: <Help/> },
  { path: 'simple-mode', component: <SimpleModeContainer/>, ssrData: ssrDataLoaders.simpleMode },
  { path: 'excerpt', component: <ExcerptContainer/> },
  { path: 'likutim', component: <LikutimMain/> },
  { path: 'likutim/:id', component: <Likut/>, ssrData: ssrDataLoaders.likutPage },
  { path: 'sketches', component: <Sketches/>, ssrData: ssrDataLoaders.programsPage },
  { path: 'about', component: <AboutPage/>, ssrData: ssrDataLoaders.aboutPage },
]);

export default buildRoutes;
