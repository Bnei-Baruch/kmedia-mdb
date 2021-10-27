import React, { useCallback, useContext, useEffect } from 'react';
import { withRouter } from 'react-router';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, Grid, Header, Icon } from 'semantic-ui-react';
import clsx from 'clsx';

import { actions, selectors } from '../../../../redux/modules/my';
import { MY_NAMESPACE_REACTIONS, MY_NAMESPACE_PLAYLISTS } from '../../../../helpers/consts';
import { selectors as settings } from '../../../../redux/modules/settings';
import { selectors as auth } from '../../../../redux/modules/auth';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import { getPageFromLocation } from '../../../Pagination/withPagination';
import CUItemContainer from '../../../shared/CUItem/CUItemContainer';
import WipErr from '../../../shared/WipErr/WipErr';
import AlertModal from '../../../shared/AlertModal';
import Pagination from '../../../Pagination/Pagination';
import Link from '../../../Language/MultiLanguageLink';
import ReactionActions from './Actions';
import NeedToLogin from '../NeedToLogin';

const PAGE_SIZE = 20;
const Page      = ({ location, t }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const pageNo   = useSelector(state => selectors.getPageNo(state.my, MY_NAMESPACE_REACTIONS));
  const total    = useSelector(state => selectors.getTotal(state.my, MY_NAMESPACE_REACTIONS));
  const language = useSelector(state => settings.getLanguage(state.settings));
  const items    = useSelector(state => selectors.getItems(state.my, MY_NAMESPACE_REACTIONS)) || [];
  const wip      = useSelector(state => selectors.getWIP(state.my, MY_NAMESPACE_REACTIONS));
  const err      = useSelector(state => selectors.getErr(state.my, MY_NAMESPACE_REACTIONS));
  const deleted  = useSelector(state => selectors.getDeleted(state.my, MY_NAMESPACE_REACTIONS));
  const user     = useSelector(state => auth.getUser(state.auth));

  const dispatch = useDispatch();
  const setPage  = useCallback(pageNo => dispatch(actions.setPage(MY_NAMESPACE_REACTIONS, pageNo)), [dispatch]);

  const onAlertCloseHandler = () => dispatch(actions.setDeleted(MY_NAMESPACE_REACTIONS, false));

  useEffect(() => {
    if (user) {
      const pageNoLocation = getPageFromLocation(location);
      if (pageNoLocation !== pageNo) setPage(pageNoLocation);
    }
  }, [user, location, pageNo, language, setPage]);

  useEffect(() => {
    dispatch(actions.fetch(MY_NAMESPACE_REACTIONS, { page_no: pageNo, page_size: PAGE_SIZE }));
  }, [pageNo, language, dispatch]);

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
                <Icon name="heart outline" className="display-iblock" />
                {t('personal.likes')}
                <Header.Subheader className="display-iblock margin-right-8 margin-left-8">
                  {`${total} ${t('personal.videosOnList')}`}
                </Header.Subheader>
              </Header>
              <Link to={`/${MY_NAMESPACE_PLAYLISTS}/${MY_NAMESPACE_REACTIONS}`}>
                <Button basic className="clear_button">
                  <Icon name={'play circle outline'} className="margin-left-8 margin-right-8" size="big" />
                  {t('personal.playAll')}
                </Button>
              </Link>
            </div>
          </Container>
          <AlertModal message={t('personal.removedSuccessfully')} open={deleted} onClose={onAlertCloseHandler} />
          {
            items?.length > 0 ? (
              <Container className="padded">
                {items.map((x, i) =>
                  (
                    <CUItemContainer id={x.content_unit_uid} asList={true} key={i}>
                      <ReactionActions cuId={x.content_unit_uid} id={x.id} />
                    </CUItemContainer>
                  )
                )}
              </Container>) : null
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
          !isMobileDevice && <Grid.Column mobile={16} tablet={6} computer={6} />
        }
      </Grid.Row>
    </Grid>
  );
};

export default withNamespaces()(withRouter(Page));
