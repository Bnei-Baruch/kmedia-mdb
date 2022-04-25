import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectors as filtersAside, selectors } from '../../../redux/modules/filtersAside';
import { withNamespaces } from 'react-i18next';
import { FN_CONTENT_TYPE, UNIT_EVENTS_TYPE, UNIT_LESSONS_TYPE } from '../../../helpers/consts';
import ContentTypeItem from './ContentTypeItem';
import FilterHeader from '../FilterHeader';
import { Checkbox, List } from 'semantic-ui-react';
import { actions, selectors as filters } from '../../../redux/modules/filters';

const ContentType = ({ namespace, t }) => {
  const items = useSelector(state => selectors.getTree(state.filtersAside, namespace, FN_CONTENT_TYPE));

  const { lessons, events, other } = items.reduce((acc, x) => {
    if (UNIT_LESSONS_TYPE.includes(x)) {
      acc.lessons.push(x);
    } else if (UNIT_EVENTS_TYPE.includes(x)) {
      acc.events.push(x);
    } else {
      acc.other.push(x);
    }

    return acc;
  }, { lessons: [], events: [], other: [] });

  const selected = useSelector(state => filters.getFilterByName(state.filters, namespace, FN_CONTENT_TYPE))?.values || [];
  const lStats   = useSelector(state => UNIT_LESSONS_TYPE.reduce(
    (acc, x) => acc + filtersAside.getStats(state.filtersAside, namespace, FN_CONTENT_TYPE, x), 0)
  );
  const eStats   = useSelector(state => UNIT_EVENTS_TYPE.reduce(
    (acc, x) => acc + filtersAside.getStats(state.filtersAside, namespace, FN_CONTENT_TYPE, x), 0)
  );

  const dispatch = useDispatch();

  if (!(items?.length > 0)) return null;

  const handleSelect = (e, { checked, value }) => {
    const types = value === 'lessons' ? UNIT_LESSONS_TYPE : UNIT_EVENTS_TYPE;
    const val   = [...selected].filter(x => !types.includes(x));
    if (checked) {
      val.push(...types);
    }

    dispatch(actions.setFilterValueMulti(namespace, FN_CONTENT_TYPE, val));
  };

  const lSelCount = selected.filter(x => UNIT_LESSONS_TYPE.includes(x)).length;
  const eSelCount = selected.filter(x => UNIT_EVENTS_TYPE.includes(x)).length;
  return (
    <FilterHeader
      filterName={FN_CONTENT_TYPE}
      children={
        <>
          {
            lessons.length > 0 && (
              <List.Item key={`lessons`} className="filters-aside-ct">
                <List.Content className="bold-font">
                  <Checkbox
                    label={t('filters.aside-filter.lessons')}
                    checked={lSelCount === UNIT_LESSONS_TYPE.length}
                    onChange={handleSelect}
                    disabled={lStats === 0}
                    indeterminate={lSelCount > 0 && lSelCount !== UNIT_LESSONS_TYPE.length}
                    value="lessons"
                  />
                </List.Content>
                <List>
                  {lessons.map(id => <ContentTypeItem namespace={namespace} id={id} key={id} />)}
                </List>
              </List.Item>
            )
          }
          {
            events.length > 0 && (
              <List.Item key={`events`} className="filters-aside-ct">
                <List.Content>
                  <Checkbox
                    label={t('filters.aside-filter.events')}
                    checked={eSelCount === UNIT_EVENTS_TYPE.length}
                    onChange={handleSelect}
                    disabled={eStats === 0}
                    indeterminate={eSelCount > 0 && eSelCount !== UNIT_EVENTS_TYPE.length}
                    value="events"
                  />
                </List.Content>
                <List>
                  {events.map(id => <ContentTypeItem namespace={namespace} id={id} key={id} />)}
                </List>
              </List.Item>
            )
          }
          {other.map(id => <ContentTypeItem namespace={namespace} id={id} key={id} />)}
        </>
      }
    />
  );
};

export default withNamespaces()(ContentType);
