import { sagas as lessonsSagas } from './lessons';
import { sagas as sourcesSagas } from './sources';
import { sagas as filterSagas } from './filters';

export default [
  ...lessonsSagas,
  ...sourcesSagas,
  ...filterSagas
];
