import React, { useCallback, useContext, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
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

  const computerWidth = isMobileDevice ? 'w-full' : 'w-full md:w-[62.5%]';

  return (
    <div className={clsx('flex flex-wrap avbox no-background', { 'p-4': !isMobileDevice })}>
      <div className="flex flex-wrap w-full">
        <div className={clsx(computerWidth, { 'is-fitted': isMobileDevice })}>
          <div className=" px-4 ">
            <div className="summary-container align_items_center">
              <h2 className="my_header">
                <span className="material-symbols-outlined display-iblock">favorite_border</span>
                {t('personal.reactions')}
                <span className="display-iblock margin-right-8 margin-left-8 small text-gray-500">
                  {`${total} ${t('personal.videosOnList')}`}
                </span>
              </h2>
              <Link to={`/${MY_NAMESPACE_PLAYLISTS}/${MY_NAMESPACE_REACTIONS}`}>
                <button className="clear_button inline-flex items-center border-none bg-transparent">
                  <span className="material-symbols-outlined text-3xl margin-left-8 margin-right-8">play_circle</span>
                  {t('personal.playAll')}
                </button>
              </Link>
            </div>
          </div>
          <AlertModal message={t('personal.removedSuccessfully')} open={deleted} onClose={onAlertCloseHandler}/>
          {
            items?.length > 0 ? (
              <div className=" px-4 ">
                {items.map((x, i) =>
                  (
                    <ContentItemContainer id={x.subject_uid} asList={true} key={i}>
                      <ReactionActions cuId={x.subject_uid} reaction={x}/>
                    </ContentItemContainer>
                  )
                )}
              </div>
            ) : null
          }
            <Pagination
              pageNo={pageNo}
              pageSize={PAGE_SIZE}
              total={total}
              onChange={setPage}
            />
        </div>
        {
          !isMobileDevice && <div className="w-full md:w-[37.5%]"/>
        }
      </div>
    </div>
  );
};

export default withTranslation()(withRouter(Page));
