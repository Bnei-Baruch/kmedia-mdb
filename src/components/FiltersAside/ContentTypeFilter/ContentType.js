import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../redux/modules/filtersAside';
import { withNamespaces } from 'react-i18next';
import { FN_CONTENT_TYPE, UNIT_EVENTS_TYPE, UNIT_LESSONS_TYPE } from '../../../helpers/consts';
import ContentTypeItem from './ContentTypeItem';
import FilterHeader from '../FilterHeader';
import { List } from 'semantic-ui-react';

const ContentType = ({ namespace, t }) => {
  const items                      = useSelector(state => selectors.getTree(state.filtersAside, namespace, FN_CONTENT_TYPE));
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

  return (
    <FilterHeader
      filterName={FN_CONTENT_TYPE}
      children={
        <>
          {
            lessons.length > 0 && (
              <List.Item key={`lessons`}>
                <List.Content className="bold-font">
                  {t('filters.aside-filter.lessons')}
                </List.Content>
                <List>
                  {lessons.map(id => <ContentTypeItem namespace={namespace} id={id} />)}
                </List>
              </List.Item>
            )
          }
          {
            events.length > 0 && (
              <List.Item key={`events`}>
                <List.Content className="bold-font">
                  {t('filters.aside-filter.events')}
                </List.Content>
                <List>
                  {events.map(id => <ContentTypeItem namespace={namespace} id={id} />)}
                </List>
              </List.Item>
            )
          }
          {other.map(id => <ContentTypeItem namespace={namespace} id={id} />)}
        </>
      }
    />
  );
};

export default withNamespaces()(ContentType);
