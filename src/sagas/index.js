import { sagas as lessonsSagas } from './lessons';
import { sagas as filterSagas } from './filters';

export default [
  ...lessonsSagas,
  ...filterSagas
];
