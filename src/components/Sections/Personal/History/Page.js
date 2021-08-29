import React, { useContext, useEffect } from 'react';
import { withRouter } from 'react-router';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Divider, Grid, Header, Icon, Label, Table } from 'semantic-ui-react';
import clsx from 'clsx';
import moment from 'moment';

import { actions, selectors } from '../../../../redux/modules/my';
import { MY_NAMESPACE_HISTORY, MY_NAMESPACE_PLAYLISTS } from '../../../../helpers/consts';
import WipErr from '../../../shared/WipErr/WipErr';
import CUItemContainer from '../../../shared/CUItem/CUItemContainer';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import Link from '../../../Language/MultiLanguageLink';
import { selectors as settings } from '../../../../redux/modules/settings';
import { getPageFromLocation } from '../../../Pagination/withPagination';
import Pagination from '../../../Pagination/Pagination';
import Actions from './Actions';

const PAGE_SIZE = 20;
const Page      = ({ location, t }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const pageNo   = useSelector(state => selectors.getPageNo(state.my, MY_NAMESPACE_HISTORY));
  const total    = useSelector(state => selectors.getTotal(state.my, MY_NAMESPACE_HISTORY));
  const language = useSelector(state => settings.getLanguage(state.settings));
  const items    = useSelector(state => selectors.getItems(state.my, MY_NAMESPACE_HISTORY)) || [];
  const wip      = useSelector(state => selectors.getWIP(state.my, MY_NAMESPACE_HISTORY));
  const err      = useSelector(state => selectors.getErr(state.my, MY_NAMESPACE_HISTORY));

  const dispatch = useDispatch();
  const setPage  = (pageNo) => dispatch(actions.setPage(MY_NAMESPACE_HISTORY, pageNo));
  useEffect(() => {
    const pageNoLocation = getPageFromLocation(location);
    if (pageNoLocation !== pageNo) setPage(pageNoLocation);
  }, [dispatch, location, pageNo, language]);

  useEffect(() => {
    dispatch(actions.fetch(MY_NAMESPACE_HISTORY, { page_no: pageNo, page_size: PAGE_SIZE }));
  }, [pageNo, language]);

  const wipErr = WipErr({ wip, err, t });
  if (wipErr) return wipErr;

  const computerWidth = isMobileDevice ? 16 : 10;

  const renderItem = (x, i) => {
    let newDay = null;
    const mp   = i !== 0 && moment(items[i - 1].created_at);
    const mx   = moment(x.created_at);
    const diff = i !== 0 ? mp.diff(mx, 'days') : 1;
    if (diff > 0) {
      newDay = <Header as="h3" content={t('values.date', { date: x.created_at })} />;
    }
    const item = (
      <CUItemContainer id={x.content_unit_uid} asList={true} key={i} playTime={x.data.current_time}>
        <Actions cuId={x.content_unit_uid} id={x.id} />
      </CUItemContainer>
    );
    return (
      <>
        {newDay}
        {item}
      </>
    );
  };

  return (
    <Grid padded={!isMobileDevice}>
      <Grid.Column mobile={16} tablet={computerWidth} computer={computerWidth} className={clsx({ 'is-fitted': isMobileDevice })}>
        <Container>
          <div className="summary-container">
            <Header as={'h2'} className="my_header">
              <Icon name="history" className="display-iblock" />
              {t('personal.history')}
              <Header.Subheader className="display-iblock margin-right-8 margin-left-8">
                {`${t('personal.videos')} ${total}`}
              </Header.Subheader>
            </Header>
          </div>
        </Container>
        {
          items?.length > 0 ? (
            <Table unstackable basic="very" className="index" sortable>
              <Table.Body>
                {items.map(renderItem)}
              </Table.Body>
            </Table>) : null
        }
        <Divider fitted />
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
    </Grid>
  );
};

export default withNamespaces()(withRouter(Page));
