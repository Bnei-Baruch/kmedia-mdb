import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import dateFilter from '../../../filters/definitions/dateFilter';
import {
  FN_COLLECTION_MULTI,
  FN_CONTENT_TYPE,
  FN_DATE_FILTER,
  FN_LANGUAGES,
  FN_LOCATIONS,
  FN_MEDIA_TYPE,
  FN_ORIGINAL_LANGUAGES,
  FN_PERSON,
  FN_PUBLISHER,
  FN_SOURCES_MULTI,
  FN_TOPICS_MULTI,
  LANGUAGES
} from '../../../helpers/consts';
import { chipKey, SLOT_TO_FILTER, SMART_NAMESPACE } from '../../../helpers/smartSearch';
import { actions as filterActions } from '../../../redux/modules/filters';
import { actions as searchActions } from '../../../redux/modules/search';
import { getTitle } from '../../FiltersAside/LocationsFilter/helper';
import {
  filtersGetFiltersSelector,
  mdbGetPersonByIdSelector,
  mdbNestedGetCollectionByIdSelector,
  publicationsGetPublisherByIdSelector,
  searchGetSmartMetaSelector,
  sourcesGetPathByIDSelector,
  tagsGetPathByIDSelector
} from '../../../redux/selectors';

const CHIP_FILTERS = Object.values(SLOT_TO_FILTER);
const PATH_SEPARATOR = ' › ';

/**
 * Chips of the smart search = current not empty filters of the 'search' namespace (the source of truth),
 * so filters set in the aside panel are shown too.
 * Each chip: { key, name, value, mention, segments: [{ id, label }] } — segments are the tree path
 * (root → node) for sources/topics, a single segment otherwise.
 */
const useSmartChips = () => {
  const { t }    = useTranslation();
  const dispatch = useDispatch();

  const list            = useSelector(state => filtersGetFiltersSelector(state, SMART_NAMESPACE)) || [];
  const meta            = useSelector(searchGetSmartMetaSelector);
  const getSourcePath   = useSelector(sourcesGetPathByIDSelector);
  const getTagPath      = useSelector(tagsGetPathByIDSelector);
  const getCById        = useSelector(mdbNestedGetCollectionByIdSelector);
  const getPersonById   = useSelector(mdbGetPersonByIdSelector);
  const publisherById   = useSelector(publicationsGetPublisherByIdSelector);

  const treeSegments = (path, field) => path.filter(Boolean).map(x => ({ id: x.id, label: x[field] }));

  const labelByFilter = (name, value) => {
    switch (name) {
      case FN_CONTENT_TYPE:
        return t(`filters.content-types.${value}`);
      case FN_MEDIA_TYPE:
        return t(`filters.media-types.${value}`);
      case FN_LANGUAGES:
      case FN_ORIGINAL_LANGUAGES:
        return LANGUAGES[value]?.name;
      case FN_DATE_FILTER:
        return dateFilter.valueToTagLabel(value);
      case FN_PERSON:
        return getPersonById(value)?.name;
      case FN_COLLECTION_MULTI:
        return getCById(value)?.name;
      case FN_PUBLISHER:
        return publisherById?.[value]?.name;
      case FN_LOCATIONS:
        return getTitle(value, t);
      default:
        return null;
    }
  };

  const segmentsOf = (name, value, m) => {
    let segments = [];
    if (name === FN_SOURCES_MULTI) segments = treeSegments(getSourcePath(value), 'name');
    if (name === FN_TOPICS_MULTI) segments = treeSegments(getTagPath(value), 'label');
    if (segments.length) return segments;

    // Collections/persons may be not loaded yet — fall back to the parser's label.
    const label = labelByFilter(name, value) || m?.label?.split(PATH_SEPARATOR).pop() || String(value);
    return [{ id: value, label }];
  };

  const chips = list
    .filter(f => CHIP_FILTERS.includes(f.name) && f.values?.length)
    .flatMap(f => f.values.filter(Boolean).map(value => {
      const key = chipKey(f.name, value);
      return { key, name: f.name, value, mention: meta[key]?.mention, segments: segmentsOf(f.name, value, meta[key]) };
    }));

  const valuesOf = name => list.find(f => f.name === name)?.values || [];

  const removeChip = ({ name, value }) => {
    const values = name === FN_DATE_FILTER ? null : valuesOf(name).filter(v => v !== value);
    dispatch(filterActions.setFilterValueMulti(SMART_NAMESPACE, name, values));
  };

  // Tree chip: replace the node with one of its ancestors (filter by the whole book instead of a part).
  const broadenChip = ({ name, value, mention }, ancestorId) => {
    const values = valuesOf(name).filter(v => v !== value && v !== ancestorId);
    // Keep the original words so the broadened chip can still go back to text.
    dispatch(searchActions.smartSetChipMeta({ key: chipKey(name, ancestorId), meta: { mention } }));
    dispatch(filterActions.setFilterValueMulti(SMART_NAMESPACE, name, [...values, ancestorId]));
  };

  // Same label as the chip would have — for proposals in the omnibox dropdown.
  const labelOf = (name, value, label) => {
    // Parser dates are not ranges yet ({ year } / { relative }) — show the typed words.
    if (name === FN_DATE_FILTER && !value?.from) return label;
    return segmentsOf(name, value, { label }).map(s => s.label).join(PATH_SEPARATOR);
  };

  return { chips, removeChip, broadenChip, labelOf };
};

export default useSmartChips;
