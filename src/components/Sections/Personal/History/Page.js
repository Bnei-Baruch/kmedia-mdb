import React, { useCallback, useContext, useEffect } from 'react';
import { withRouter } from 'react-router';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Grid, Header, Icon } from 'semantic-ui-react';
import clsx from 'clsx';
import moment from 'moment';

import { actions, selectors } from '../../../../redux/modules/my';
import { selectors as settings } from '../../../../redux/modules/settings';
import { selectors as auth } from '../../../../redux/modules/auth';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import { MY_NAMESPACE_HISTORY } from '../../../../helpers/consts';
import WipErr from '../../../shared/WipErr/WipErr';
import AlertModal from '../../../shared/AlertModal';
import ContentItemContainer from '../../../shared/ContentItem/ContentItemContainer';
import { getPageFromLocation } from '../../../Pagination/withPagination';
import Pagination from '../../../Pagination/Pagination';
import Actions from './Actions';
import NeedToLogin from '../NeedToLogin';

const PAGE_SIZE = 20;
const Page      = ({ location, t }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const pageNo   = useSelector(state => selectors.getPageNo(state.my, MY_NAMESPACE_HISTORY));
  const total    = useSelector(state => selectors.getTotal(state.my, MY_NAMESPACE_HISTORY));
  const language = useSelector(state => settings.getLanguage(state.settings));
  const items    = useSelector(state => selectors.getItems(state.my, MY_NAMESPACE_HISTORY)) || [];
  const wip      = useSelector(state => selectors.getWIP(state.my, MY_NAMESPACE_HISTORY));
  const err      = useSelector(state => selectors.getErr(state.my, MY_NAMESPACE_HISTORY));
  const deleted  = useSelector(state => selectors.getDeleted(state.my, MY_NAMESPACE_HISTORY));
  const user     = useSelector(state => auth.getUser(state.auth));

  const dispatch = useDispatch();
  const setPage  = useCallback(pageNo => dispatch(actions.setPage(MY_NAMESPACE_HISTORY, pageNo)), [dispatch]);

  const onAlertCloseHandler = () => dispatch(actions.setDeleted(MY_NAMESPACE_HISTORY, false));

  useEffect(() => {
    if (user) {
      const pageNoLocation = getPageFromLocation(location);
      if (pageNoLocation !== pageNo) setPage(pageNoLocation);
    }
  }, [user, location, pageNo, language, setPage]);

  useEffect(() => {
    dispatch(actions.fetch(MY_NAMESPACE_HISTORY, { page_no: pageNo, page_size: PAGE_SIZE }));
  }, [pageNo, language, dispatch]);

  const needToLogin = NeedToLogin({ t });
  if (needToLogin) return needToLogin;

  const wipErr = WipErr({ wip, err, t });
  if (wipErr) return wipErr;

  const computerWidth = isMobileDevice ? 16 : 10;

  const renderItem = (x, i) => {
    let newDay   = null;
    const mp     = i !== 0 && moment(items[i - 1].created_at);
    const mx     = moment(x.created_at);
    const isDiff = i !== 0 ? mp.date() !== mx.date() : true;
    if (isDiff) {
      newDay = (<Header as="h3" content={t('values.date', { date: x.created_at })} />);
    }

    const item = (
      <ContentItemContainer id={x.content_unit_uid} asList={true} playTime={x.data.current_time}>
        <Actions cuId={x.content_unit_uid} id={x.id} />
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
                <Icon name="history" className="display-iblock" />
                {t('personal.history')}
              </Header>
            </div>
          </Container>
          <AlertModal message={t('personal.removedSuccessfully')} open={deleted} onClose={onAlertCloseHandler} />
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
          !isMobileDevice && <Grid.Column mobile={16} tablet={6} computer={6} />
        }
      </Grid.Row>
    </Grid>
  );
};

export default withNamespaces()(withRouter(Page));
