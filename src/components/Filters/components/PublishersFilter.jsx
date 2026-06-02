import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import FlatListFilter from './FlatListFilter';
import { publicationsGetPublisherByIdSelector } from '../../../redux/selectors';

const PublishersFilter = props => {
  const publisherById = useSelector(publicationsGetPublisherByIdSelector);
  const options       = Object.values(publisherById).map(x => ({
    text : x.name,
    value: x.id
  }));

  return (
    <FlatListFilter name="publishers-filter" options={options} {...props} />
  );
};

PublishersFilter.propTypes = {
  publisherById: PropTypes.objectOf(PropTypes.object)
};

export default PublishersFilter;
