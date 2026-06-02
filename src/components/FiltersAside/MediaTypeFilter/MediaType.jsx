import React from 'react';
import { useSelector } from 'react-redux';
import { FN_MEDIA_TYPE } from '../../../helpers/consts';
import FilterHeader from '../FilterHeader';
import MediaTypeItem from './MediaTypeItem';
import { filtersAsideGetTreeSelector } from '../../../redux/selectors';

const MT_FOR_SHOW = ['image', 'video', 'text', 'image'];
const MediaType   = ({ namespace }) => {
  const items = useSelector(state => filtersAsideGetTreeSelector(state, namespace, FN_MEDIA_TYPE));

  if (!(items?.length > 0)) return null;

  return (
    <FilterHeader
      filterName={FN_MEDIA_TYPE}
      children={
        <>
          {
            items.filter(x => MT_FOR_SHOW.includes(x)).map(id =>
              <MediaTypeItem namespace={namespace} id={id} key={id}/>
            )
          }
        </>
      }
    />
  );
};

export default MediaType;
