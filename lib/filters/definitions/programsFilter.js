import pickBy from 'lodash/pickBy';

import { selectors as mdb } from '../../redux/slices/mdbSlice/mdbSlice';
import { createFilterDefinition } from './util';
import { FN_PROGRAMS } from '../../../src/helpers/consts';
import { useSelector } from 'react-redux';
import { useTranslation } from 'next-i18next';

const Label = ({ value }) => {
  const collection = useSelector(state => mdb.getCollectionById(state.mdb, value));
  const { t }      = useTranslation();

  if (!value) {
    return '';
  }

  const [genre, program] = value;

  if (program) {
    return collection ? collection.name : program;
  }

  if (genre) {
    return t(`programs.genres.${genre}`);
  }

  return '';
};

const programsFilter = {
  name: FN_PROGRAMS,
  queryKey: 'program',
  apiKey: 'program',
  valueToQuery: value => value.join('_'),
  queryToValue: value => value.split('_'),
  valueToApiParam: value => {
    const [genre, program] = value;
    return pickBy({ genre, program }, x => !!x);
  },
  valueToTagLabel: Label
};

export default createFilterDefinition(programsFilter);
