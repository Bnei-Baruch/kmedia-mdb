import React  from 'react';
import PropTypes from 'prop-types';

import { Segment, Menu as RMenu } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

export const Pagination = ({ totalItems = 10, pageSize = 10, currentPage = 1, onSetPage }) => {
  if (totalItems === 10 || totalItems <= pageSize) {
    return <Segment> Loading... </Segment>;
  }

  const range = [];
  for (let i = 0; i < Math.ceil(totalItems / pageSize); i++) {
    range.push(i);
  }

  const setPage = page => onSetPage(page);

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
        onClick={page => setPage(page)}
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
  onSetPage  : PropTypes.func.isRequired
};
