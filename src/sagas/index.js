import { sagas as lessons } from './lessons';
import { sagas as programs } from './programs';
import { sagas as sources } from './sources';
import { sagas as filters } from './filters';
import { sagas as tags } from './tags';
import { sagas as settings } from './settings';

export default [
  ...lessons,
  ...programs,
  ...sources,
  ...filters,
  ...tags,
  ...settings,
];
