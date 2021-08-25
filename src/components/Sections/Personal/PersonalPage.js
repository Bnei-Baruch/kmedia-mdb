import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { actions, selectors } from '../../../redux/modules/my';
import { getPageFromLocation } from '../../Pagination/withPagination';

import ItemsByNamespace from './Main/ItemsByNamespace';
import { Container, Divider } from 'semantic-ui-react';
import Pagination from '../../Pagination/Pagination';
import * as shapes from '../../shapes';
import { selectors as settings } from '../../../redux/modules/settings';

const PAGE_SIZE    = 12;
const PersonalPage = ({ location, namespace }) => {
  const dispatch = useDispatch();

  const pageNo   = useSelector(state => selectors.getPageNo(state.my, namespace));
  const total    = useSelector(state => selectors.getTotal(state.my, namespace));
  const language = useSelector(state => settings.getLanguage(state.settings));

  const setPage = (pageNo) => dispatch(actions.setPage(namespace, pageNo));

  useEffect(() => {
    const pageNoLocation = getPageFromLocation(location);
    if (pageNoLocation !== pageNo)
      setPage(pageNoLocation);
  }, [dispatch, location, pageNo, language]);

  return (
    <div>
      <ItemsByNamespace pageNo={pageNo} pageSize={PAGE_SIZE} namespace={namespace} />
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

PersonalPage.propTypes = {
  namespace: PropTypes.string.isRequired,
  location: shapes.HistoryLocation.isRequired,
};
export default withRouter(PersonalPage);
