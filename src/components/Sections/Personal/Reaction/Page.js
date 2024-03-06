import React, { useCallback, useContext, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, Grid, Header, Icon } from 'semantic-ui-react';
import clsx from 'clsx';

import { actions } from '../../../../redux/modules/my';
import { MY_NAMESPACE_REACTIONS, MY_NAMESPACE_PLAYLISTS } from '../../../../helpers/consts';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import { getPageFromLocation } from '../../../Pagination/withPagination';
import ContentItemContainer from '../../../shared/ContentItem/ContentItemContainer';
import WipErr from '../../../shared/WipErr/WipErr';
import AlertModal from '../../../shared/AlertModal';
import Pagination from '../../../Pagination/Pagination';
import Link from '../../../Language/MultiLanguageLink';
import ReactionActions from './Actions';
import NeedToLogin from '../NeedToLogin';
import { withRouter } from '../../../../helpers/withRouterPatch';
import {
  settingsGetContentLanguagesSelector,
  myGetDeletedSelector,
  myGetListSelector,
  myGetErrSelector,
  myGetPageNoSelector,
  myGetTotalSelector,
  myGetWipSelector,
  authGetUserSelector
} from '../../../../redux/selectors';

const PAGE_SIZE = 20;
const Page      = ({ location, t }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const pageNo           = useSelector(state => myGetPageNoSelector(state, MY_NAMESPACE_REACTIONS));
  const total            = useSelector(state => myGetTotalSelector(state, MY_NAMESPACE_REACTIONS));
  const contentLanguages = useSelector(settingsGetContentLanguagesSelector);
  const items            = useSelector(state => myGetListSelector(state, MY_NAMESPACE_REACTIONS));
  const wip              = useSelector(state => myGetWipSelector(state, MY_NAMESPACE_REACTIONS));
  const err              = useSelector(state => myGetErrSelector(state, MY_NAMESPACE_REACTIONS));
  const deleted          = useSelector(state => myGetDeletedSelector(state, MY_NAMESPACE_REACTIONS));
  const user             = useSelector(authGetUserSelector);

  const dispatch = useDispatch();
  const setPage  = useCallback(pageNo => dispatch(actions.setPage(MY_NAMESPACE_REACTIONS, pageNo)), [dispatch]);

  const onAlertCloseHandler = () => dispatch(actions.setDeleted(MY_NAMESPACE_REACTIONS, false));

  useEffect(() => {
    if (user) {
      const pageNoLocation = getPageFromLocation(location);
      if (pageNoLocation !== pageNo) setPage(pageNoLocation);
    }
  }, [user, location, pageNo, contentLanguages, setPage]);

  useEffect(() => {
    dispatch(actions.fetch(MY_NAMESPACE_REACTIONS, { page_no: pageNo, page_size: PAGE_SIZE }));
  }, [pageNo, contentLanguages, dispatch]);

  const needToLogin = NeedToLogin({ t });
  if (needToLogin) return needToLogin;

  const wipErr = WipErr({ wip, err, t });
  if (wipErr) return wipErr;

  const computerWidth = isMobileDevice ? 16 : 10;

  return (
    <Grid padded={!isMobileDevice} className="avbox no-background">
      <Grid.Row>
        <Grid.Column mobile={16} tablet={computerWidth} computer={computerWidth} className={clsx({ 'is-fitted': isMobileDevice })}>
          <Container className="padded">
            <div className="summary-container align_items_center">
              <Header as={'h2'} className="my_header">
                <Icon name="heart outline" className="display-iblock"/>
                {t('personal.reactions')}
                <Header.Subheader className="display-iblock margin-right-8 margin-left-8">
                  {`${total} ${t('personal.videosOnList')}`}
                </Header.Subheader>
              </Header>
              <Link to={`/${MY_NAMESPACE_PLAYLISTS}/${MY_NAMESPACE_REACTIONS}`}>
                <Button basic className="clear_button">
                  <Icon name={'play circle outline'} className="margin-left-8 margin-right-8" size="big"/>
                  {t('personal.playAll')}
                </Button>
              </Link>
            </div>
          </Container>
          <AlertModal message={t('personal.removedSuccessfully')} open={deleted} onClose={onAlertCloseHandler}/>
          {
            items?.length > 0 ? (
              <Container className="padded">
                {items.map((x, i) =>
                  (
                    <ContentItemContainer id={x.subject_uid} asList={true} key={i}>
                      <ReactionActions cuId={x.subject_uid} reaction={x}/>
                    </ContentItemContainer>
                  )
                )}
              </Container>
            ) : null
          }
          <Container className="padded pagination-wrapper" textAlign="center">
            <Pagination
              pageNo={pageNo}
              pageSize={PAGE_SIZE}
              total={total}
              onChange={setPage}
            />
          </Container>
        </Grid.Column>
        {
          !isMobileDevice && <Grid.Column mobile={16} tablet={6} computer={6}/>
        }
      </Grid.Row>
    </Grid>
  );
};

export default withTranslation()(withRouter(Page));
