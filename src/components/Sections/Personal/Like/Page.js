import React, { useContext, useEffect } from 'react';
import { withRouter } from 'react-router';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, Grid, Header, Icon, Table } from 'semantic-ui-react';
import clsx from 'clsx';

import { actions, selectors } from '../../../../redux/modules/my';
import { MY_NAMESPACE_LIKES, MY_NAMESPACE_PLAYLISTS } from '../../../../helpers/consts';
import WipErr from '../../../shared/WipErr/WipErr';
import CUItemContainer from '../../../shared/CUItem/CUItemContainer';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import { selectors as settings } from '../../../../redux/modules/settings';
import { getPageFromLocation } from '../../../Pagination/withPagination';
import Pagination from '../../../Pagination/Pagination';
import LikeActions from './Actions';

const PAGE_SIZE = 20;
const Page      = ({ location, t }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const pageNo   = useSelector(state => selectors.getPageNo(state.my, MY_NAMESPACE_LIKES));
  const total    = useSelector(state => selectors.getTotal(state.my, MY_NAMESPACE_LIKES));
  const language = useSelector(state => settings.getLanguage(state.settings));
  const items    = useSelector(state => selectors.getItems(state.my, MY_NAMESPACE_LIKES)) || [];
  const wip      = useSelector(state => selectors.getWIP(state.my, MY_NAMESPACE_LIKES));
  const err      = useSelector(state => selectors.getErr(state.my, MY_NAMESPACE_LIKES));

  const dispatch = useDispatch();
  const setPage  = (pageNo) => dispatch(actions.setPage(MY_NAMESPACE_LIKES, pageNo));
  useEffect(() => {
    const pageNoLocation = getPageFromLocation(location);
    if (pageNoLocation !== pageNo) setPage(pageNoLocation);
  }, [dispatch, location, pageNo, language]);

  useEffect(() => {
    dispatch(actions.fetch(MY_NAMESPACE_LIKES, { page_no: pageNo, page_size: PAGE_SIZE }));
  }, [pageNo, language]);

  const wipErr = WipErr({ wip, err, t });
  if (wipErr) return wipErr;

  const computerWidth = isMobileDevice ? 16 : 10;

  return (
    <Grid padded={!isMobileDevice} className="avbox no-background">
      <Grid.Column mobile={16} tablet={computerWidth} computer={computerWidth} className={clsx({ 'is-fitted': isMobileDevice })}>
        <Container className="padded">
          <div className="summary-container align_items_center">
            <Header as={'h2'} className="my_header">
              <Icon name="heart outline" className="display-iblock" />
              {t('personal.likes')}
              <Header.Subheader className="display-iblock margin-right-8 margin-left-8">
                {`${t('personal.videosOnList')} ${total}`}
              </Header.Subheader>
            </Header>
            <Button
              basic
              className="clear_button"
              href={`/${language}/${MY_NAMESPACE_PLAYLISTS}/${MY_NAMESPACE_LIKES}`}
            >
              <Icon name={'play circle outline'} className="margin-left-8 margin-right-8" size="big" />
              {t('personal.playAll')}
            </Button>
          </div>
        </Container>
        {
          items?.length > 0 ? (
            <Container className="padded">
              <Table unstackable basic="very">
                <Table.Body>
                  {items.map((x, i) => (
                      <CUItemContainer id={x.content_unit_uid} asList={true} key={i}>
                        <LikeActions cuId={x.content_unit_uid} id={x.id} />
                      </CUItemContainer>
                    )
                  )}
                </Table.Body>
              </Table>
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
    </Grid>
  );
};

export default withNamespaces()(withRouter(Page));
