import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../redux/modules/filtersAside';
import { withNamespaces } from 'react-i18next';
import { FN_CONTENT_TYPE } from '../../../helpers/consts';
import ContentTypeItem from './ContentTypeItem';
import FilterHeader from '../FilterHeader';

const ContentType = ({ namespace, t }) => {
  const items = useSelector(state => selectors.getTree(state.filtersAside, namespace, FN_CONTENT_TYPE));

  return (
    <FilterHeader
      filterName={FN_CONTENT_TYPE}
      children={
        items.map(id => <ContentTypeItem namespace={namespace} id={id} />)
      }
    />
  );
};

export default withNamespaces()(ContentType);
