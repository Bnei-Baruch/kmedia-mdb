import React from 'react';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Icon, Label } from 'semantic-ui-react';

import dateFilter from '../../filters/definitions/dateFilter';
import {
  FN_COLLECTION_MULTI,
  FN_CONTENT_TYPE, FN_FREE_TEXT,
  FN_DATE_FILTER,
  FN_LANGUAGES, FN_LOCATIONS,
  FN_MEDIA_TYPE,
  FN_ORIGINAL_LANGUAGES,
  FN_PERSON,
  FN_SOURCES_MULTI,
  FN_TOPICS,
  FN_TOPICS_MULTI,
  LANGUAGES, FN_PART_OF_DAY
} from '../../helpers/consts';
import { actions } from '../../redux/modules/filters';
import { getTitle } from './LocationsFilter/helper';
import { filtersGetFiltersSelector, mdbGetPersonByIdSelector, sourcesGetSourceByIdSelector, tagsGetTagByIdSelector, mdbNestedGetCollectionByIdSelector } from '../../redux/selectors';

const FilterLabels = ({ namespace, t }) => {
  const list          = useSelector(state => filtersGetFiltersSelector(state, namespace)) || [];
  const getSourceById = useSelector(sourcesGetSourceByIdSelector);
  const getTagById    = useSelector(tagsGetTagByIdSelector);
  const getCById      = useSelector(mdbNestedGetCollectionByIdSelector);
  const getPersonById = useSelector(mdbGetPersonByIdSelector);

  const dispatch = useDispatch();

  const titleByFilterType = (fn, val) => {
    switch (fn) {
      case FN_SOURCES_MULTI:
        return getSourceById(val)?.name;
      case FN_TOPICS:
      case FN_TOPICS_MULTI:
        return getTagById(val)?.label;
      case FN_CONTENT_TYPE:
        return t(`filters.content-types.${val}`);
      case FN_DATE_FILTER:
        return dateFilter.valueToTagLabel(val);
      case FN_LANGUAGES:
        return LANGUAGES[val]?.name;
      case FN_PERSON:
        return getPersonById(val)?.name;
      case FN_COLLECTION_MULTI:
        return getCById(val).name;
      case FN_MEDIA_TYPE:
        return t(`filters.media-types.${val}`);
      case FN_ORIGINAL_LANGUAGES:
        return `${t('filters.aside-filter.original-language-filter')}: ${LANGUAGES[val]?.name}`;
      case FN_LOCATIONS:
        return getTitle(val, t);
      case FN_FREE_TEXT:
        return `${t('filters.aside-filter.free-text')}: ${val}`;
      case FN_PART_OF_DAY:
        return t(`lessons.list.nameByNum_${val}`);
      default:
        return null;
    }

  };

  const onRemove = (fn, id) => {
    let val = null;
    if (fn !== FN_DATE_FILTER)
      val = list.find(x => x.name === fn).values?.filter(x => !!x && (x !== id)) || null;
    dispatch(actions.setFilterValueMulti(namespace, fn, val));
  };

  const renderItem = (name, val, key) => (
    <Label
      basic
      circular
      size="tiny"
      key={key}
    >
      {
        titleByFilterType(name, val)
      }
      <Icon name="times circle outline" size="large" inverted circular onClick={() => onRemove(name, val)}/>
    </Label>
  );

  return (
    <Container className="filter_aside_labels">
      <span>{t('filters.filters')}:</span>
      {
        list.filter(f => f.values?.length > 0).flatMap((f, j) =>
          f.values.map((v, i) => renderItem(f.name, v, `${j}_${i}`))
        )
      }
    </Container>
  );
};

export default withTranslation()(FilterLabels);
