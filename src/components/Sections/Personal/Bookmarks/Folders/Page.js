import React, { useCallback, useContext, useEffect } from 'react';
import { withRouter } from 'react-router';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, Grid, Header, Icon } from 'semantic-ui-react';
import clsx from 'clsx';

import { actions, selectors } from '../../../../redux/modules/my';
import { MY_NAMESPACE_BOOKMARKS } from '../../../../helpers/consts';
import { selectors as settings } from '../../../../redux/modules/settings';
import { selectors as auth } from '../../../../redux/modules/auth';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import { getPageFromLocation } from '../../../Pagination/withPagination';
import WipErr from '../../../shared/WipErr/WipErr';
import NeedToLogin from '../NeedToLogin';

const PAGE_SIZE = 20;
const Page      = ({ location, t }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const pageNo   = useSelector(state => selectors.getPageNo(state.my, MY_NAMESPACE_BOOKMARKS));
  const total    = useSelector(state => selectors.getTotal(state.my, MY_NAMESPACE_BOOKMARKS));
  const language = useSelector(state => settings.getLanguage(state.settings));
  const items    = useSelector(state => selectors.getList(state.my, MY_NAMESPACE_BOOKMARKS));
  const wip      = useSelector(state => selectors.getWIP(state.my, MY_NAMESPACE_BOOKMARKS));
  const err      = useSelector(state => selectors.getErr(state.my, MY_NAMESPACE_BOOKMARKS));
  const deleted  = useSelector(state => selectors.getDeleted(state.my, MY_NAMESPACE_BOOKMARKS));
  const user     = useSelector(state => auth.getUser(state.auth));

  const dispatch = useDispatch();
  const setPage  = useCallback(pageNo => dispatch(actions.setPage(MY_NAMESPACE_BOOKMARKS, pageNo)), [dispatch]);

  const onAlertCloseHandler = () => dispatch(actions.setDeleted(MY_NAMESPACE_BOOKMARKS, false));

  useEffect(() => {
    if (user) {
      const pageNoLocation = getPageFromLocation(location);
      if (pageNoLocation !== pageNo) setPage(pageNoLocation);
    }
  }, [user, location, pageNo, language, setPage]);

  useEffect(() => {
    dispatch(actions.fetch(MY_NAMESPACE_BOOKMARKS, { page_no: pageNo, page_size: PAGE_SIZE }));
  }, [pageNo, language, dispatch]);

  const needToLogin = NeedToLogin({ t });
  if (needToLogin) return needToLogin;

  const wipErr = WipErr({ wip, err, t });
  if (wipErr) return wipErr;

  const computerWidth = isMobileDevice ? 16 : 10;

  return (
    <Grid padded={!isMobileDevice}>
      <Grid.Row>
        <Grid.Column mobile={16} tablet={computerWidth} computer={computerWidth} className={clsx({ 'is-fitted': isMobileDevice })}>
          <Container className="padded">
            <Bookmarks />
          </Container>
        </Grid.Column>
        <Grid.Column mobile={16} tablet={6} computer={6}>
          <Folders/>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default withNamespaces()(withRouter(Page));
