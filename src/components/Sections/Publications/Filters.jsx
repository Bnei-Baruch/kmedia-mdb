
import FiltersHydrator from '../../FiltersAside/FiltersHydrator';
import FiltersAsideTitle from '../../FiltersAside/FiltersAsideTitle';
import DateFilter from '../../FiltersAside/DateFilter';

const Filters = ({ namespace }) => (
  <>
    <FiltersHydrator namespace={namespace} />
    <FiltersAsideTitle/>
    <DateFilter namespace={namespace} />
  </>
);

export default Filters;
