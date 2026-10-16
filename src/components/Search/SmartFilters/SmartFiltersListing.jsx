import { useDispatch, useSelector } from 'react-redux';

import { COLLECTION_DAILY_LESSONS, CT_COLLECTIONS, EVENT_TYPES } from '../../../helpers/consts';
import { SMART_NAMESPACE } from '../../../helpers/smartSearch';
import { actions } from '../../../redux/modules/search';
import { listsGetNamespaceStateSelector, searchGetPageNoSelector, settingsGetPageSizeSelector } from '../../../redux/selectors';
import FilterLabels from '../../FiltersAside/FilterLabels';
import Pagination from '../../Pagination/Pagination';
import ResultsPageHeader from '../../Pagination/ResultsPageHeader';
import EventItem from '../../Sections/Events/CollectionItem';
import CollectionItem from '../../Sections/Lessons/Filters/Collectiontem';
import DailyLessonItem from '../../Sections/Lessons/Filters/DailyLessonItem';
import UnitItem from '../../Sections/Lessons/Filters/UnitItem';
import SectionFiltersWithMobile from '../../shared/SectionFiltersWithMobile';
import { getWipErr } from '../../shared/WipErr/WipErr';
import Filters from '../Filters';
import SmartSuggestions from './SmartSuggestions';

const renderItem = ({ id, content_type }) => {
  switch (true) {
    case COLLECTION_DAILY_LESSONS.includes(content_type):
      return <DailyLessonItem id={id} key={id}/>;
    case EVENT_TYPES.includes(content_type):
      return <EventItem id={id} key={id}/>;
    case CT_COLLECTIONS.includes(content_type):
      return <CollectionItem id={id} key={id}/>;
    default:
      return <UnitItem id={id} key={id}/>;
  }
};

// Search page with filters only (no text): items listed by filters, rendered like the lessons/events pages.
const SmartFiltersListing = () => {
  const { items, total, wip, err } = useSelector(state => listsGetNamespaceStateSelector(state, SMART_NAMESPACE)) || {};
  const pageNo   = useSelector(searchGetPageNoSelector);
  const pageSize = useSelector(settingsGetPageSizeSelector);

  const dispatch = useDispatch();
  const setPage  = page => dispatch(actions.setPage(page));

  const wipErr = getWipErr(wip, err);

  return (
    <SectionFiltersWithMobile namespace={SMART_NAMESPACE} filters={<Filters namespace={SMART_NAMESPACE}/>}>
      <SmartSuggestions/>
      <ResultsPageHeader pageNo={pageNo} total={total} pageSize={pageSize}/>
      <FilterLabels namespace={SMART_NAMESPACE}/>
      {wipErr || items?.filter(({ id }) => !!id).map(renderItem)}
      <hr className="m-0 border-t"/>
      {total > 0 && <Pagination pageNo={pageNo} pageSize={pageSize} total={total} onChange={setPage}/>}
    </SectionFiltersWithMobile>
  );
};

export default SmartFiltersListing;
