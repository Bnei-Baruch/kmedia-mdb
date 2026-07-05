import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { FN_PUBLISHER } from '../../../../../helpers/consts';
import { publicationsGetPublisherByIdSelector } from '../../../../../redux/selectors';
import FilterHeader from '../../../../FiltersAside/FilterHeader';
import PublisherItem from './PublisherItem';

const PublishersFilter = ({ namespace }) => {
  const publisherById = useSelector(publicationsGetPublisherByIdSelector);

  const publishers = useMemo(() =>
    Object.values(publisherById)
      .filter(x => x?.name)
      .sort((a, b) => (a.name === b.name ? 0 : a.name > b.name ? 1 : -1)),
  [publisherById]);

  if (publishers.length === 0) return null;

  return (
    <FilterHeader
      filterName={FN_PUBLISHER}
      children={publishers.map(item => (
        <PublisherItem key={item.id} namespace={namespace} item={item} />
      ))}
    />
  );
};

export default PublishersFilter;
