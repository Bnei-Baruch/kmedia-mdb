import pickBy from 'lodash/pickBy';

import { selectors as mdbSelectors } from '../../redux/modules/mdb';
import { createFilterDefinition } from './util';

const programsFilter = {
  name: 'programs-filter',
  queryKey: 'program',
  valueToQuery: value => value.join('_'),
  queryToValue: value => value.split('_'),
  valueToApiParam: (value) => {
    const [genre, program] = value;
    return pickBy({ genre, program }, x => !!x);
  },
  valueToTagLabel: (value, props, store, t) => {
    if (!value) {
      return '';
    }

    const [genre, program] = value;

    if (program) {
      const collection = mdbSelectors.getCollectionById(store.getState().mdb, program);
      return collection ? collection.name : program;
    }

    if (genre) {
      return t(`programs.genres.${genre}`);
    }

    return '';
  }
};

export default createFilterDefinition(programsFilter);
