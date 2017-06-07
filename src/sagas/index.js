import { sagas as lessonsSagas } from './lessons';
import { sagas as sourcesSagas } from './sources';

export default [
  ...lessonsSagas,
  ...sourcesSagas,
];
