import React from 'react';
import { useSelector } from 'react-redux';
import { FN_MEDIA_TYPE } from '../../../../src/helpers/consts';
import { selectors } from '../../../redux/slices/filterSlice/filterStatsSlice';
import FilterHeader from '../FilterHeader';
import MediaTypeItem from './MediaTypeItem';

const MT_FOR_SHOW = ['image', 'video', 'text', 'image'];
const MediaType   = ({ namespace }) => {
  const items = useSelector(state => selectors.getTree(state.filterStats, namespace, FN_MEDIA_TYPE));

  if (!(items?.length > 0)) return null;

  return (
    <FilterHeader
      filterName={FN_MEDIA_TYPE}
      children={
        <>
          {
            items.filter(x => MT_FOR_SHOW.includes(x)).map(id =>
              <MediaTypeItem namespace={namespace} id={id} key={id} />
            )
          }
        </>
      }
    />
  );
};

export default MediaType;