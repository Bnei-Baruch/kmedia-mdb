import React from 'react';
import Events from './../components/Sections/Events/MainPage';
import ExcerptContainer from './../components/Sections/Excerpt/ExcerptContainer';
import Help from './../components/Sections/Help/Help';
import HomePage from './../components/Sections/Home/Container';
import LessonCollection from './../components/Sections/Lesson/LessonPage';
import Lessons from './../components/Sections/Lessons/MainPage';
import LibraryHomepage from '../components/Sections/Sources/Homepage';
import SourceContainer from '../components/Sections/Source/SourceContainer';
import LibraryPerson from '../components/Sections/Sources/LibraryPerson';
import Likut from './../components/Sections/Likutim/Likut';
import LikutimMain from './../components/Sections/Likutim/MainPage';
import Music from './../components/Sections/Music/Music';
import BookmarksPage from './../components/Sections/Personal/Bookmarks/Page';
import HistoryPage from './../components/Sections/Personal/History/Page';
import Main from './../components/Sections/Personal/Main/Page';
import PlaylistPage from './../components/Sections/Personal/Playlist/Page';
import ReactionPage from './../components/Sections/Personal/Reaction/Page';
import Program from './../components/Sections/Program/ProgramPage';
import Programs from './../components/Sections/Programs/MainPage';
import Publications from './../components/Sections/Publications/MainPage';
import ArticleCollection from './../components/Sections/Publications/tabs/Articles/Collection';
import ArticlePage from './../components/Sections/Publications/tabs/Articles/Unit';
import BlogPost from './../components/Sections/Publications/tabs/Blog/Post/Container';
import SimpleModeContainer from './../components/Sections/SimpleMode/Container';
import Topics from './../components/Sections/Topics/TopicContainer';
import Topic from './../components/Sections/Topics/TopicPage';
import {
  MY_NAMESPACE_HISTORY,
  MY_NAMESPACE_REACTIONS,
  MY_NAMESPACE_PLAYLISTS,
  MY_NAMESPACE_BOOKMARKS,
  PAGE_NS_PROGRAMS
} from '../helpers/consts';
import Sketches from './../components/Sections/Sketches/MainPage';
import SearchResults from './../components/Search/SearchResults';
import PlaylistLastDaily from './../components/Pages/WithPlayer/LastDaily/PlaylistLastDaily';
import {
  PlaylistItemPageLesson,
  PlaylistItemPageEvent,
  PlaylistCollectionPage,
  PlaylistItemPageSeries,
  PlaylistItemPageProgram,
  PlaylistItemPageVirtual
} from '../components/Pages/WithPlayer/PlaylistPageDispecher';

import * as ssrDataLoaders from './routesSSRData';
import PlaylistMy from './../components/Pages/WithPlayer/PlaylistMy/Container';
import AboutPage from '../components/Sections/About/AboutPage';

const useRoutes = playerContainer => ([
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

export default useRoutes;
