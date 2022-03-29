import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../redux/modules/filtersAside';
import { withNamespaces } from 'react-i18next';
import { FN_CONTENT_TYPE } from '../../../helpers/consts';
import { List } from 'semantic-ui-react';
import ContentTypeItem from './ContentTypeItem';

const ContentType = ({ namespace, t }) => {
  const items = useSelector(state => selectors.getTree(state.filtersAside, namespace, FN_CONTENT_TYPE));

  return (
    <List>
      <List.Header content={t(`filters.aside-titles.${FN_CONTENT_TYPE}`)} />
      {
        items.map(id => <ContentTypeItem namespace={namespace} id={id} />)
      }
    </List>
  );
};

export default withNamespaces()(ContentType);
