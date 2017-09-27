import { createFilterDefinition } from './util';
import { selectors as mdbSelectors } from '../../redux/modules/mdb';
import { isEmpty } from '../../helpers/utils';

const programsFilter = {
  name: 'programs-filter',
  queryKey: 'program',
  valueToQuery: value => JSON.stringify(value), // Convert filter value to query param
  queryToValue: queryValue => JSON.parse(queryValue), // convert query param to filter value
  valueToApiParam: value => (value),  // convert filter value for api
  tagIcon: 'block layout',           // https://react.semantic-ui.com/elements/icon
  valueToTagLabel: (value, props, { getState }) => {
    if (!value) {
      return '';
    }

    const programName = value.program;
    if (!isEmpty(programName)) {
      const program = mdbSelectors.getCollectionById(getState().mdb, programName);
      return program ? program.name : programName;
    }

    const genre = value.genre;
    if (!isEmpty(genre)) {
      return genre;
    }

    return '';
  }
};

export default createFilterDefinition(programsFilter);
