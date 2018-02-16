import pickBy from 'lodash/pickBy';

import { createFilterDefinition } from './util';
import { selectors as mdbSelectors } from '../../redux/modules/mdb';
import { isEmpty } from '../../helpers/utils';

const programsFilter = {
  name: 'programs-filter',
  queryKey: 'program',
  valueToQuery: value => [value.genre, value.program].map(x => x ? x : '').join('|'),
  queryToValue: queryValue => {
    const [genre, program] = queryValue.split('|');
    return { genre, program };
  },
  valueToApiParam: value => pickBy(value, x => !!x),
  tagIcon: 'tv',
  valueToTagLabel: (value, props, store, t) => {
    if (!value) {
      return '';
    }

    const programName = value.program;
    if (!isEmpty(programName)) {
      const program = mdbSelectors.getCollectionById(store.getState().mdb, programName);
      return program ? program.name : programName;
    }

    const genre = value.genre;
    if (!isEmpty(genre)) {
      return t(`programs.genres.${genre}`);
    }

    return '';
  }
};

export default createFilterDefinition(programsFilter);
