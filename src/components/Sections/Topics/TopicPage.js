import React, { useContext, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Divider, Header } from 'semantic-ui-react';

import { actions } from '../../../redux/modules/tags';
import { actions as listsActions } from '../../../redux/modules/lists';
import Pagination from '../../Pagination/Pagination';
import { isEqual } from 'lodash';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import RenderPage from './RenderPage';
import RenderPageMobile from './RenderPageMobile';
import { getPageFromLocation } from '../../Pagination/withPagination';
import { PAGE_NS_TOPICS } from '../../../helpers/consts';
import {
  settingsGetContentLanguagesSelector,
  filtersGetNotEmptyFiltersSelector,
  tagsGetPathByIDSelector,
  tagsGetTagsSelector,
  tagsGetItemsSelector,
  settingsGetPageSizeSelector
} from '../../../redux/selectors';

const TopicPage = () => {
  const { id }             = useParams();
  const { t }              = useTranslation();
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const getPathByID      = useSelector(tagsGetPathByIDSelector);
  const getTags          = useSelector(tagsGetTagsSelector);
  const contentLanguages = useSelector(settingsGetContentLanguagesSelector);
  const selected         = useSelector(state => filtersGetNotEmptyFiltersSelector(state, `topics_${id}`), isEqual);

  const { mediaTotal, textTotal } = useSelector(tagsGetItemsSelector);
  const total                     = Math.max(mediaTotal, textTotal);

  const dispatch = useDispatch();

  const pageSize = useSelector(settingsGetPageSizeSelector);
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
      {isMobileDevice ? <RenderPageMobile/> : <RenderPage/>}
      <Divider fitted/>
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
