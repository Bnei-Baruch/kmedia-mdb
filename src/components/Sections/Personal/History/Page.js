import React, { useCallback, useContext, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Grid, Header, Icon } from 'semantic-ui-react';
import clsx from 'clsx';
import moment from 'moment';

import { actions } from '../../../../redux/modules/my';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import { MY_NAMESPACE_HISTORY } from '../../../../helpers/consts';
import WipErr from '../../../shared/WipErr/WipErr';
import AlertModal from '../../../shared/AlertModal';
import ContentItemContainer from '../../../shared/ContentItem/ContentItemContainer';
import { getPageFromLocation } from '../../../Pagination/withPagination';
import Pagination from '../../../Pagination/Pagination';
import Actions from './Actions';
import NeedToLogin from '../NeedToLogin';
import { withRouter } from '../../../../helpers/withRouterPatch';
import { settingsGetContentLanguagesSelector, myGetDeletedSelector, myGetListSelector, myGetErrSelector, myGetPageNoSelector, myGetTotalSelector, myGetWipSelector, authGetUserSelector } from '../../../../redux/selectors';

export const PAGE_SIZE = 20;

const Page = ({ location, t }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const pageNo           = useSelector(state => myGetPageNoSelector(state, MY_NAMESPACE_HISTORY));
  const total            = useSelector(state => myGetTotalSelector(state, MY_NAMESPACE_HISTORY));
  const contentLanguages = useSelector(settingsGetContentLanguagesSelector);
  const items            = useSelector(state => myGetListSelector(state, MY_NAMESPACE_HISTORY));
  const wip              = useSelector(state => myGetWipSelector(state, MY_NAMESPACE_HISTORY));
  const err              = useSelector(state => myGetErrSelector(state, MY_NAMESPACE_HISTORY));
  const deleted          = useSelector(state => myGetDeletedSelector(state, MY_NAMESPACE_HISTORY));
  const user             = useSelector(authGetUserSelector);

  const dispatch = useDispatch();
  const setPage  = useCallback(pageNo => dispatch(actions.setPage(MY_NAMESPACE_HISTORY, pageNo)), [dispatch]);

  const onAlertCloseHandler = () => dispatch(actions.setDeleted(MY_NAMESPACE_HISTORY, false));

  useEffect(() => {
    if (user) {
      const pageNoLocation = getPageFromLocation(location);
      if (pageNoLocation !== pageNo) setPage(pageNoLocation);
    }
  }, [user, location, pageNo, contentLanguages, setPage]);

  useEffect(() => {
    dispatch(actions.fetch(MY_NAMESPACE_HISTORY, { page_no: pageNo, page_size: PAGE_SIZE }));
  }, [pageNo, contentLanguages, dispatch]);

  const needToLogin = NeedToLogin({ t });
  if (needToLogin) return needToLogin;

  const wipErr = WipErr({ wip, err, t });
  if (wipErr) return wipErr;

  const computerWidth = isMobileDevice ? 16 : 10;

  const renderItem = (x, i) => {
    let newDay   = null;
    const mp     = i !== 0 && moment(items[i - 1].timestamp);
    const mx     = moment(x.timestamp);
    const isDiff = i !== 0 ? mp.date() !== mx.date() : true;
    if (isDiff) {
      newDay = (<Header as="h3" content={t('values.date', { date: x.timestamp })}/>);
    }

    const item = (
      <ContentItemContainer id={x.content_unit_uid} asList={true} playTime={x.data.current_time}>
        <Actions history={x}/>
      </ContentItemContainer>
    );
    return (
      <React.Fragment key={i}>
        {newDay}
        {item}
      </React.Fragment>
    );
  };

  return (
    <Grid padded={!isMobileDevice} className="avbox no-background">
      <Grid.Row>
        <Grid.Column mobile={16} tablet={computerWidth} computer={computerWidth} className={clsx({ 'is-fitted': isMobileDevice })}>
          <Container className="padded">
            <div className="summary-container align_items_center">
              <Header as={'h2'} className="my_header">
                <Icon name="history" className="display-iblock"/>
                {t('personal.history')}
              </Header>
            </div>
          </Container>
          <AlertModal message={t('personal.removedSuccessfully')} open={deleted} onClose={onAlertCloseHandler}/>
          {
            items?.length > 0 ? (
              <Container className="padded">
                {items.map(renderItem)}
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
