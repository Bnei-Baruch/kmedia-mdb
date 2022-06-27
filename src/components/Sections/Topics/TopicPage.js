import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { Container, Divider, Header } from 'semantic-ui-react';

import { actions, selectors } from '../../../redux/modules/tags';
import { selectors as settings } from '../../../redux/modules/settings';
import Pagination from '../../Pagination/Pagination';
import { selectors as filters } from '../../../redux/modules/filters';
import { isEqual } from 'lodash';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import RenderPage from './RenderPage';
import RenderPageMobile from './RenderPageMobile';

const TopicPage = ({ t }) => {
  const { id } = useParams();

  const [pageNo, setPageNo] = useState(0);

  const { isMobileDevice } = useContext(DeviceInfoContext);

  const pageSize = isMobileDevice ? 10 : 50;

  const getPathByID = useSelector(state => selectors.getPathByID(state.tags));
  const getTags     = useSelector(state => selectors.getTags(state.tags));
  const language    = useSelector(state => settings.getLanguage(state.settings));
  const selected    = useSelector(state => filters.getFilters(state.filters, `topics_${id}`), isEqual);

  const { mediaTotal, textTotal } = useSelector(state => selectors.getItems(state.tags));
  const total                     = Math.max(mediaTotal, textTotal);

  const dispatch = useDispatch();

  useEffect(() => {
    const page_no = pageNo > 1 ? pageNo : 1;
    dispatch(actions.fetchDashboard({ tag: id, page_size: pageSize, page_no }));
  }, [id, language, dispatch, pageNo, pageSize, selected]);

  if (!getPathByID) {
    const tag = getTags ? getTags[id] : null;
    return (
      <Container className="padded">
        <Header as="h3">
          {t(`nav.sidebar.topic`)}
          {' "'}
          {tag ? tag.label : id}
          {'" '}
          {t(`nav.sidebar.not-found`)}
        </Header>
      </Container>
    );
  }

  const onPageChange = n => setPageNo(n);

  return (
    <>
      {isMobileDevice ? <RenderPageMobile /> : <RenderPage />}
      <Divider fitted />
      <Container className="padded pagination-wrapper" textAlign="center">
        {
          total > 0 &&
          <Pagination
            pageNo={pageNo}
            pageSize={pageSize}
            total={total}
            language={language}
            onChange={onPageChange}
          />
        }
      </Container>
    </>
  );
};

TopicPage.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(TopicPage);
