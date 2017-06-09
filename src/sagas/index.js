import { sagas as lessonsSagas } from './lessons';
import { sagas as sourcesSagas } from './sources';
import { sagas as tagsSagas } from './tags';

export default [
  ...lessonsSagas,
  ...sourcesSagas,
  ...tagsSagas,
];
