import PropTypes from 'prop-types';
import { PLAYER_MODE } from './AVPlayer/constants';

export const WIP    = PropTypes.bool;
export const WipMap = PropTypes.objectOf(PropTypes.oneOfType([WIP, PropTypes.objectOf(WIP)]));

export const Error     = PropTypes.oneOfType([PropTypes.object, PropTypes.string]);
export const ErrorsMap = PropTypes.objectOf(PropTypes.oneOfType([Error, PropTypes.objectOf(Error)]));

export const RouterMatch = PropTypes.shape({
  isExact: PropTypes.bool,
  params: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
});

export const HistoryLocation = PropTypes.shape({
  hash: PropTypes.string.isRequired,
  key: PropTypes.string, // only in createBrowserHistory and createMemoryHistory
  pathname: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
  state: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool,
    PropTypes.number,
    PropTypes.object,
    PropTypes.string,
  ]), // only in createBrowserHistory and createMemoryHistory,
});

export const History = PropTypes.shape({
  action: PropTypes.oneOf(['PUSH', 'REPLACE', 'POP']).isRequired,
  block: PropTypes.func.isRequired,
  canGo: PropTypes.func, // only in createMemoryHistory
  createHref: PropTypes.func.isRequired,
  entries: PropTypes.arrayOf(HistoryLocation), // only in createMemoryHistory
  go: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  index: PropTypes.number, // only in createMemoryHistory
  length: PropTypes.number,
  listen: PropTypes.func.isRequired,
  location: HistoryLocation.isRequired,
  push: PropTypes.func.isRequired,
  replace: PropTypes.func.isRequired,
});

export const Route = PropTypes.shape({
  path: PropTypes.string,
  exact: PropTypes.bool,
  strict: PropTypes.bool,
  sensitive: PropTypes.bool,
  component: PropTypes.elementType,
});
Route.routes       = PropTypes.arrayOf(PropTypes.shape(Route));

export const MDBFile = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  subtype: PropTypes.string,
  mimetype: PropTypes.string,
  language: PropTypes.string,
  size: PropTypes.number,
  duration: PropTypes.number,
});

const MDBBaseContentUnit = {
  id: PropTypes.string.isRequired,
  content_type: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  files: PropTypes.arrayOf(MDBFile),
  cIDs: PropTypes.objectOf(PropTypes.string),    // ccu.name => Collection ID
  sduIDs: PropTypes.objectOf(PropTypes.string),  // sdu.name => Source Derived Units ID  (i.e parents)
  dduIDs: PropTypes.objectOf(PropTypes.string),  // ddu.name => Derived Derived Units IDs (i.e children)
  tags: PropTypes.arrayOf(PropTypes.string),
  sources: PropTypes.arrayOf(PropTypes.string),
};

const MDBBaseCollection = {
  id: PropTypes.string.isRequired,
  content_type: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  cuIDs: PropTypes.arrayOf(PropTypes.string),      // Content Units IDs
  ccuNames: PropTypes.objectOf(PropTypes.string),  // cuID -> ccu.name
};

const MDBDenormalizedContentUnit = {
  ...MDBBaseContentUnit,
  collections: PropTypes.objectOf(PropTypes.shape(MDBBaseCollection)),     // ccu.name -> collection
  source_units: PropTypes.objectOf(PropTypes.shape(MDBBaseContentUnit)),   // sdu.name => Source Derived Unit
  derived_units: PropTypes.objectOf(PropTypes.shape(MDBBaseContentUnit)),  // ddu.name => Derived Derived Unit
};

const MDBDenormalizedCollection = {
  ...MDBBaseCollection,
  content_units: PropTypes.arrayOf(PropTypes.shape(MDBBaseContentUnit)),
};

export const GenericCollection = PropTypes.shape(MDBDenormalizedCollection);

export const ContentUnit = PropTypes.shape(MDBBaseContentUnit);

export const Collection = PropTypes.shape(MDBBaseCollection);

export const LessonCollection = PropTypes.shape({
  ...MDBDenormalizedCollection,
  film_date: PropTypes.string.isRequired,
  number: PropTypes.number,
});

export const LessonPart = PropTypes.shape({
  ...MDBDenormalizedContentUnit,
  film_date: PropTypes.string.isRequired,
});

export const ProgramCollection = PropTypes.shape({
  ...MDBDenormalizedCollection,
  genres: PropTypes.arrayOf(PropTypes.string),
  default_language: PropTypes.string,
});

export const ProgramChapter = PropTypes.shape({
  ...MDBDenormalizedContentUnit,
  film_date: PropTypes.string.isRequired,
});

export const Lecture = PropTypes.shape({
  ...MDBDenormalizedContentUnit,
  film_date: PropTypes.string.isRequired,
});

export const Article = PropTypes.shape({
  ...MDBDenormalizedContentUnit,
  film_date: PropTypes.string,
  original_language: PropTypes.string,
});

export const EventCollection = PropTypes.shape({
  ...MDBDenormalizedCollection,
  start_date: PropTypes.string.isRequired,
  end_date: PropTypes.string.isRequired,
  city: PropTypes.string,
  country: PropTypes.string,
  full_address: PropTypes.string,
  holiday_id: PropTypes.string,
});

export const EventItem = PropTypes.shape({
  ...MDBDenormalizedContentUnit,
  film_date: PropTypes.string.isRequired,
});

export const Author = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  full_name: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.string),
});

export const Source = PropTypes.shape({
  id: PropTypes.string.isRequired,
  parent_id: PropTypes.string,
  type: PropTypes.string.isRequired,
  name: PropTypes.string,
  description: PropTypes.string,
});

export const Topics = PropTypes.arrayOf(PropTypes.shape({
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
}));

export const Publisher = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  description: PropTypes.string,
});

export const Banner = PropTypes.shape({
  wip: WIP,
  err: Error,
  data: PropTypes.shape({
    content: PropTypes.string,
    header: PropTypes.string,
    'sub-header': PropTypes.string,
    link: PropTypes.string,
  }),
});

export const Tweet = PropTypes.shape({
  username: PropTypes.string.isRequired,
  twitter_id: PropTypes.string.isRequired,
  created_at: PropTypes.string.isRequired,
  raw: PropTypes.object.isRequired,
});

export const SimpleMode = PropTypes.shape({
  lessons: PropTypes.arrayOf(LessonCollection),
  others: PropTypes.arrayOf(ContentUnit),
});

export const BlogPost = PropTypes.shape({
  blog: PropTypes.string.isRequired,
  wp_id: PropTypes.number.isRequired,
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  created_at: PropTypes.string.isRequired,
});

export const filterPropShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  component: PropTypes.any.isRequired
});

export const DataWipErr = PropTypes.shape({
  data: PropTypes.any,
  wip: WIP,
  err: Error,
});

export const UserAgentParserResults = PropTypes.shape({
  ua: PropTypes.string,
  browser: PropTypes.shape({
    name: PropTypes.string,
    version: PropTypes.string,
  }),
  cpu: PropTypes.shape({
    architecture: PropTypes.string,
  }),
  device: PropTypes.shape({
    model: PropTypes.string,
    type: PropTypes.string,
    vendor: PropTypes.string,
  }),
  engine: PropTypes.shape({
    name: PropTypes.string,
    version: PropTypes.string,
  }),
  os: PropTypes.shape({
    name: PropTypes.string,
    version: PropTypes.string,
  }),
});

export const Media = PropTypes.shape({
  currentTime: PropTypes.number,
  duration: PropTypes.number,
  progress: PropTypes.number,
  volume: PropTypes.number,

  isFullScreen: PropTypes.bool,
  isLoading: PropTypes.bool,
  isMuted: PropTypes.bool,
  isPlaying: PropTypes.bool,

  addVolume: PropTypes.func,
  fullscreen: PropTypes.func,
  mute: PropTypes.func,
  muteUnmute: PropTypes.func,
  pause: PropTypes.func,
  play: PropTypes.func,
  playPause: PropTypes.func,
  seekTo: PropTypes.func,
  setVolume: PropTypes.func,
  skipTime: PropTypes.func,
  stop: PropTypes.func,
});

export const VideoItem = PropTypes.shape({
  availableLanguages: PropTypes.array,
  availableMediaTypes: PropTypes.array,
  byQuality: PropTypes.shape({
    HD: PropTypes.string,
    nHD: PropTypes.string,
  }),
  language: PropTypes.string,
  mediaType: PropTypes.string,
  preImageUrl: PropTypes.string,
  requestedLanguage: PropTypes.string,
  requestedMediaType: PropTypes.string,
  shareUrl: PropTypes.string,
  src: PropTypes.string,
  unit: PropTypes.object,
});

export const cWindow = PropTypes.shape({
  data: PropTypes.arrayOf(PropTypes.string),
  id: PropTypes.string,
});

// https://stackoverflow.com/questions/48007326/what-is-the-correct-proptype-for-a-ref-in-react
export const Reference = PropTypes.oneOfType([
  PropTypes.func,
  PropTypes.shape({ current: PropTypes.instanceOf(PropTypes.Element) })
]);

export const Children = PropTypes.oneOfType([
  PropTypes.arrayOf(PropTypes.node),
  PropTypes.node
]);

export const playerModeProp = PropTypes.oneOf(Object.values(PLAYER_MODE));
