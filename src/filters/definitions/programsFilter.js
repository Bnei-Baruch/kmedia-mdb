import { createFilterDefinition } from './util';
import { selectors as mdbSelectors } from '../../redux/modules/mdb';

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
    const key = Object.keys(value)[0];
    if (key === 'genre') {
      return value.genre;
    }

    const program = mdbSelectors.getCollectionById(getState().mdb, value.program);
    return program ? program.name : value.program;
  }
};

export default createFilterDefinition(programsFilter);
