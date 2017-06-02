import React  from 'react';
import PropTypes from 'prop-types';

import { Segment, Menu as RMenu } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

export const Pagination = ({ totalItems, pageSize, currentPage }) => {
  if (totalItems <= 0) {
    // Not enough items to display..
    return <Segment> Loading... </Segment>;
  } else if (totalItems <= pageSize) {
    return '';
  }

  const range = [];
  for (let i = 0; i < Math.ceil(totalItems / pageSize); i++) {
    range.push(i);
  }

  const menu = range.map(id =>
    (
      <RMenu.Item
        as={NavLink}
        activeClassName="active violet"
        key={id.toString()}
        to={{
          pathname: '/lessons',
          search  : `?page=${id + 1}`
        }}
      >&nbsp;{id + 1}</RMenu.Item>
    )
  );

  return (
    <Segment> Pages: {menu} </Segment>
  );
};

Pagination.defaultProps = {
  totalItems: 0
};

Pagination.propTypes = {
  totalItems : PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  pageSize   : PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
};
