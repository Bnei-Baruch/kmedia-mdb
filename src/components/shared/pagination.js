import React from 'react';
import PropTypes from 'prop-types';
import { Menu as RMenu, Segment } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

const Pagination = ({ total, pageSize, pageNo }) => {
  if (total <= 0) {
    // Not enough items to display..
    return <Segment> Loading... </Segment>;
  } else if (total <= pageSize) {
    return null;
  }

  const range = [];
  for (let i = 0; i < Math.ceil(total / pageSize); i++) {
    range.push(i);
  }

  const menu = range.map(id =>
    (
      <RMenu.Item
        as={NavLink}
        activeClassName="violet"
        active={id + 1 === pageNo}
        key={id.toString()}
        to={{
          pathname: '/lessons',
          search: `?page=${id + 1}`
        }}
      >&nbsp;{id + 1}</RMenu.Item>
    )
  );

  return (
    <Segment>
      Pages:
      <RMenu pagination>
        {menu}
      </RMenu>
    </Segment>
  );
};

Pagination.propTypes = {
  pageNo: PropTypes.number,
  pageSize: PropTypes.number.isRequired,
  total: PropTypes.number,
};

Pagination.defaultProps = {
  pageNo: 1,
  total: 0,
};

export default Pagination;
