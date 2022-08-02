import React, { useContext, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { Container, Divider, Header } from 'semantic-ui-react';

import { actions, selectors } from '../../../redux/modules/tags';
import { actions as listsActions } from '../../../redux/modules/lists';
import { selectors as settings } from '../../../redux/modules/settings';
import Pagination from '../../Pagination/Pagination';
import { selectors as filters } from '../../../redux/modules/filters';
import { isEqual } from 'lodash';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import RenderPage from './RenderPage';
import RenderPageMobile from './RenderPageMobile';
import { getPageFromLocation } from '../../Pagination/withPagination';
import { PAGE_NS_TOPICS } from '../../../helpers/consts';

const TopicPage = ({ t }) => {
  const { id } = useParams();

  const { isMobileDevice } = useContext(DeviceInfoContext);

  const getPathByID = useSelector(state => selectors.getPathByID(state.tags));
  const getTags     = useSelector(state => selectors.getTags(state.tags));
  const language    = useSelector(state => settings.getLanguage(state.settings));
  const selected    = useSelector(state => filters.getFilters(state.filters, `topics_${id}`), isEqual);

  const { mediaTotal, textTotal } = useSelector(state => selectors.getItems(state.tags));
  const total                     = Math.max(mediaTotal, textTotal);

  const dispatch = useDispatch();

  const pageSize = useSelector(state => settings.getPageSize(state.settings));
  const location = useLocation();
  const pageNo   = useMemo(() => getPageFromLocation(location) || 1, [location]);

  const handleSetPage = useCallback(pageNo => dispatch(listsActions.setPage(PAGE_NS_TOPICS, pageNo)), [dispatch]);

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
            onChange={handleSetPage}
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
