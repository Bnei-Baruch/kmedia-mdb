import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, Icon, Label } from 'semantic-ui-react';
import { actions, selectors as filters } from '../../redux/modules/filters';
import { selectors as sources } from '../../redux/modules/sources';
import { selectors as tags } from '../../redux/modules/tags';
import { withNamespaces } from 'react-i18next';
import {
  FN_CONTENT_TYPE,
  FN_DATE_FILTER,
  FN_LANGUAGES,
  FN_SOURCES_MULTI,
  FN_TOPICS,
  LANGUAGES
} from '../../helpers/consts';
import dateFilter from '../../filters/definitions/dateFilter';

const FilterLabels = ({ namespace, t }) => {

  const list          = useSelector(state => filters.getFilters(state.filters, namespace)) || [];
  const getSourceById = useSelector(state => sources.getSourceById(state.sources));
  const getTagById    = useSelector(state => tags.getTagById(state.sources));

  const dispatch = useDispatch();

  const titleByFilterType = (fn, val) => {
    switch (fn) {
      case FN_SOURCES_MULTI:
        return getSourceById(val)?.name;
      case FN_TOPICS:
        return getTagById(val)?.label;
      case FN_CONTENT_TYPE:
        return t(`constants.content-types.${val}`);
      case FN_DATE_FILTER:
        return dateFilter.valueToTagLabel(val);
      case FN_LANGUAGES:
        return LANGUAGES[val]?.name;
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

  const renderItem = (name, val) => (
    <Label
      basic
      circular
      size="tiny"
    >
      {
        titleByFilterType(name, val)
      }
      <Icon name="times circle outline" size="large" inverted circular  onClick={() => onRemove(name, val)} />
    </Label>
  );

  return (
    <Container className="filter_aside_labels">
      {
        list.filter(f => f.values?.length > 0).flatMap(f => f.values.map(v => renderItem(f.name, v)))
      }
    </Container>
  );
};

export default withNamespaces()(FilterLabels);
