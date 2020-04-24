import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { selectors } from '../../../redux/modules/publications';
import FlatListFilter from './FlatListFilter';

const PublishersFilter = props => {
  const publisherById = useSelector(state => selectors.getPublisherById(state.publications));
  const options       = Object.values(publisherById).map(x => ({
    text: x.name,
    value: x.id,
  }));

  return (
    <FlatListFilter name="publishers-filter" options={options} {...props} />
  );
};

PublishersFilter.propTypes = {
  publisherById: PropTypes.objectOf(PropTypes.object),
};

export default PublishersFilter;
