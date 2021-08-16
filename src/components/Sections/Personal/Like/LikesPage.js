import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { actions, selectors } from '../../../../redux/modules/my';
import { getPageFromLocation } from '../../../Pagination/withPagination';

import ItemsByNamespace from '../helper';
import { MY_NAMESPACE_LIKES } from '../../../../helpers/consts';
import { Container, Divider } from 'semantic-ui-react';
import Pagination from '../../../Pagination/Pagination';

const PAGE_SIZE = 12;
const LikesPage = ({ location }) => {
  const dispatch = useDispatch();

  const pageNo = useSelector(state => selectors.getPageNo(state.my, MY_NAMESPACE_LIKES));
  const total  = useSelector(state => selectors.getTotal(state.my, MY_NAMESPACE_LIKES));

  const setPage = (pageNo) => dispatch(actions.setPage(MY_NAMESPACE_LIKES, pageNo));

  useEffect(() => {
    const pageNoLocation = getPageFromLocation(location);
    if (pageNoLocation !== pageNo)
      setPage(pageNoLocation);
  }, [dispatch, location, pageNo]);

  return (
    <div>
      <ItemsByNamespace pageNo={pageNo} pageSize={PAGE_SIZE} namespace={MY_NAMESPACE_LIKES} />
      <Divider fitted />
      <Container className="padded pagination-wrapper" textAlign="center">
        <Pagination
          pageNo={pageNo}
          pageSize={PAGE_SIZE}
          total={total}
          onChange={setPage}
        />
      </Container>
    </div>
  );
};

LikesPage.propTypes = {
  pageNo: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
};
export default withRouter(LikesPage);
