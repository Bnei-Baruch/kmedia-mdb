
import FiltersHydrator from '../../../../FiltersAside/FiltersHydrator';
import FiltersAsideTitle from '../../../../FiltersAside/FiltersAsideTitle';
import DateFilter from '../../../../FiltersAside/DateFilter';
import Language from './LanguageFilter';

const Filters = ({ namespace }) => (
  <>
    <FiltersHydrator namespace={namespace} />
    <FiltersAsideTitle/>
    <Language namespace={namespace} />
    <DateFilter namespace={namespace} />
  </>
);

export default Filters;
