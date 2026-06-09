import { Fragment, useCallback, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { clsx } from 'clsx';
import moment from 'moment';

import { actions } from '../../../../redux/modules/my';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import { MY_NAMESPACE_HISTORY } from '../../../../helpers/consts';
import { getWipErr } from '../../../shared/WipErr/WipErr';
import AlertModal from '../../../shared/AlertModal';
import ContentItemContainer from '../../../shared/ContentItem/ContentItemContainer';
import { getPageFromLocation } from '../../../Pagination/withPagination';
import Pagination from '../../../Pagination/Pagination';
import Actions from './Actions';
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

export const PAGE_SIZE = 20;

const Page = ({ location }) => {
  const { t } = useTranslation();
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const pageNo = useSelector(state => myGetPageNoSelector(state, MY_NAMESPACE_HISTORY));
  const total = useSelector(state => myGetTotalSelector(state, MY_NAMESPACE_HISTORY));
  const contentLanguages = useSelector(settingsGetContentLanguagesSelector);
  const items = useSelector(state => myGetListSelector(state, MY_NAMESPACE_HISTORY));
  const wip = useSelector(state => myGetWipSelector(state, MY_NAMESPACE_HISTORY));
  const err = useSelector(state => myGetErrSelector(state, MY_NAMESPACE_HISTORY));
  const deleted = useSelector(state => myGetDeletedSelector(state, MY_NAMESPACE_HISTORY));
  const user = useSelector(authGetUserSelector);

  const dispatch = useDispatch();
  const setPage = useCallback(pageNo => dispatch(actions.setPage(MY_NAMESPACE_HISTORY, pageNo)), [dispatch]);

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

  const needToLogin = NeedToLogin();
  if (needToLogin) return needToLogin;

  const wipErr = getWipErr(wip, err);
  if (wipErr) return wipErr;

  const computerWidth = isMobileDevice ? 'w-full' : 'w-full md:w-[62.5%]';

  const renderItem = (x, i) => {
    let newDay = null;
    const mp = i !== 0 && moment(items[i - 1].timestamp);
    const mx = moment(x.timestamp);
    const isDiff = i !== 0 ? mp.date() !== mx.date() : true;
    if (isDiff) {
      newDay = (<h3 className="text-xl font-bold p-b-1">{t('values.date', { date: x.timestamp })}</h3>);
    }

    const item = (
      <ContentItemContainer id={x.content_unit_uid} asList={true} playTime={x.data.current_time}>
        <Actions history={x} />
      </ContentItemContainer>
    );
    return (
      <Fragment key={i}>
        {newDay}
        {item}
      </Fragment>
    );
  };

  return (
    <div className={'w-full md:p-4'}>
      <h2 className="my_header">
        <div className="flex flex-wrap items-center gap-2">
          <span className="material-symbols-outlined display-iblock">history</span>
          {t('personal.history')}
        </div>
      </h2>
      <AlertModal message={t('personal.removedSuccessfully')} open={deleted} onClose={onAlertCloseHandler} />
      {
        items?.length > 0 ? (
          <div className="px-4 ">
            {items.map(renderItem)}
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
  );
};

export default withRouter(Page);
