import React from 'react';
import { useSelector } from 'react-redux';
import { FN_MEDIA_TYPE } from '../../../helpers/consts';
import { selectors } from '../../../redux/modules/filtersAside';
import FilterHeader from '../FilterHeader';
import MediaTypeItem from './MediaTypeItem';

const MediaType = ({ namespace }) => {
  const items = useSelector(state => selectors.getTree(state.filtersAside, namespace, FN_MEDIA_TYPE));

  if (!(items?.length > 0)) return null;

  return (
    <FilterHeader
      filterName={FN_MEDIA_TYPE}
      children={
        <>
          {
            items.map(id =>
              <MediaTypeItem namespace={namespace} id={id} key={id} />
            )
          }
        </>
      }
    />
  );
};

export default MediaType;
