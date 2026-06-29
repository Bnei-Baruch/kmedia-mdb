import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { actions } from '../../../../redux/modules/my';
import { MY_NAMESPACE_REACTIONS, MY_NAMESPACE_PLAYLISTS } from '../../../../helpers/consts';
import { getPageFromLocation } from '../../../Pagination/withPagination';
import ContentItemContainer from '../../../shared/ContentItem/ContentItemContainer';
import { getWipErr } from '../../../shared/WipErr/WipErr';
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
const Page      = ({ location }) => {
  const { t } = useTranslation();

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

  const needToLogin = NeedToLogin();
  if (needToLogin) return needToLogin;

  const wipErr = getWipErr(wip, err);
  if (wipErr) return wipErr;

  return (
    <>
      <div className="px-4 bg-gray-100">
        <div className="summary-container gap-4">
          <div className="gap-2 flex items-center py-4">
            <span className="material-symbols-outlined">favorite_border</span>
            <h2 className="my_header !p-0">
              {t('personal.reactions')}
              <span className="text-gray-500 text-lg font-normal ms-2">
                {`${total} ${t('personal.videosOnList')}`}
              </span>
            </h2>
          </div>
        </div>
        {
          (total > 0) && (
            <Link to={`/${MY_NAMESPACE_PLAYLISTS}/${MY_NAMESPACE_REACTIONS}`}>
              <button className="clear_button inline-flex items-center border-none bg-transparent">
                <span className="material-symbols-outlined text-3xl margin-left-8 margin-right-8">play_circle</span>
                {t('personal.playAll')}
              </button>
            </Link>
          )
        }
      </div>
      <AlertModal message={t('personal.removedSuccessfully')} open={deleted} onClose={onAlertCloseHandler}/>
      {
        items?.length > 0 ? (
          <div className="p-4">
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
    </>
  );
};

export default withRouter(Page);
