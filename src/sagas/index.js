import { sagas as lessons } from './lessons';
import { sagas as sources } from './sources';
import { sagas as filters } from './filters';
import { sagas as tags } from './tags';
import { sagas as mdb } from './mdb';

export default [
  ...lessons,
  ...sources,
  ...filters,
  ...tags,
  ...mdb
];
