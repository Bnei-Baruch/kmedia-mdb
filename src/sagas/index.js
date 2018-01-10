import { sagas as mdb } from './mdb';
import { sagas as lessons } from './lessons';
import { sagas as programs } from './programs';
import { sagas as publications } from './publications';
import { sagas as events } from './events';
import { sagas as sources } from './sources';
import { sagas as filters } from './filters';
import { sagas as lists } from './lists';
import { sagas as tags } from './tags';
import { sagas as settings } from './settings';
import { sagas as search } from './search';
import { sagas as assets } from './assets';

export default [
  ...mdb,
  ...lessons,
  ...programs,
  ...publications,
  ...events,
  ...sources,
  ...filters,
  ...lists,
  ...tags,
  ...settings,
  ...search,
  ...assets,
];
