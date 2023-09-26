import React, { useContext, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'next-i18next';
import { Container, Divider, Header } from 'semantic-ui-react';

import { actions, selectors } from '../../../../lib/redux/slices/tagsSlice/tagsSlice';
import { actions as listsActions } from '../../../../lib/redux/slices/listSlice/listSlice';
import { selectors as settings } from '../../../../lib/redux/slices/settingsSlice/settingsSlice';
import Pagination from '../../Pagination/Pagination';
import { selectors as filters } from '../../../../lib/redux/slices/filterSlice/filterSlice';
import { isEqual } from 'lodash';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import RenderPage from './RenderPage';
import RenderPageMobile from './RenderPageMobile';
import { getPageFromLocation } from '../../Pagination/withPagination';
import { PAGE_NS_TOPICS } from '../../../helpers/consts';

const TopicPage = () => {
  const { id }             = useParams();
  const { t }              = useTranslation();
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const getPathByID      = useSelector(state => selectors.getPathByID(state.tags));
  const getTags          = useSelector(state => selectors.getTags(state.tags));
  const contentLanguages = useSelector(state => settings.getContentLanguages(state.settings));
  const selected         = useSelector(state => filters.getNotEmptyFilters(state.filters, `topics_${id}`), isEqual);

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
  }, [id, contentLanguages, dispatch, pageNo, pageSize, selected]);

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
            onChange={handleSetPage}
          />
        }
      </Container>
    </>
  );
};

export default TopicPage;
