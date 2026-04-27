import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { Dialog } from '@headlessui/react';

import { actions } from '../../../../redux/modules/my';
import { actions as statsActions } from '../../../../redux/modules/stats';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import { MY_NAMESPACE_SUBSCRIPTIONS, SECTIONS_LINK_BY_CU_CONTENT_TYPE } from '../../../../helpers/consts';
import { canonicalLink } from '../../../../helpers/links';
import Link from '../../../Language/MultiLanguageLink';
import UnitLogo from '../../../shared/Logo/UnitLogo';
import { getMyItemKey } from '../../../../helpers/my';
import {
  statsGetCUSelector,
  mdbGetDenormCollectionSelector,
  settingsGetUIDirSelector
} from '../../../../redux/selectors';

export const SubscriptionsItem = ({ item, t }) => {
  const [confirm, setConfirm] = useState();

  const { isMobileDevice } = useContext(DeviceInfoContext);

  const { key } = getMyItemKey(MY_NAMESPACE_SUBSCRIPTIONS, item);

  const collection = useSelector(state => mdbGetDenormCollectionSelector(state, item.collection_uid));
  const cuStats    = useSelector(state => statsGetCUSelector(state, key));

  const uiDir = useSelector(settingsGetUIDirSelector);

  const dispatch = useDispatch();
  const remove   = () => setConfirm(true);

  const handleConfirmCancel = () => setConfirm(false);

  const handleConfirmSuccess = () => dispatch(actions.remove(MY_NAMESPACE_SUBSCRIPTIONS, { id: item.id, key }));

  useEffect(() => {
    if (item) {
      let start = moment(item.updated_at || item.created_at);
      const now = moment(Date.now());
      const end = moment(Date.now()).add(1, 'd');
      if (start.isSame(now, 'day')) {
        start = end;
      }

      const params = {
        start_date: start.format('YYYY-MM-DD'),
        end_date  : end.format('YYYY-MM-DD'),
        count_only: true
      };
      if (item.collection_uid) params.collection = [item.collection_uid];
      if (item.content_type) params.content_type = [item.content_type];

      dispatch(statsActions.fetchCUStats(key, params));
    }
  }, [item, dispatch, key]);

  let logo, title, to;
  if (item.collection_uid) {
    logo  = <UnitLogo collectionId={collection?.id} width={isMobileDevice ? 300 : 700}/>;
    title = collection?.name;
    to    = canonicalLink(collection);
  } else {
    logo  = <UnitLogo unitId={item.content_unit_uid} width={isMobileDevice ? 300 : 700}/>;
    title = t(`constants.content-types.${item.content_type}`);
    to    = { pathname: `/${SECTIONS_LINK_BY_CU_CONTENT_TYPE[item.content_type]}` };
  }

  const borderColor = cuStats?.data?.total ? 'border-red-500' : 'border-green-500';

  return (
    <div className={`rounded-lg shadow-md overflow-hidden border-t-4 ${borderColor}`}>
      {logo}
      <div className="p-4">
        <h4 className="no-margin-top font-medium">
          <Link to={to}>
            {title}
          </Link>
        </h4>
        <p className="small text-gray-500">{`${t('personal.subsNewUnits')} - ${cuStats?.data?.total || 0}`}</p>
      </div>
      <div className="border-t p-4 text-center">
        <Dialog open={!!confirm} onClose={handleConfirmCancel} className="relative z-50">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true"/>
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6" dir={uiDir}>
              <p>{t('personal.confirmUnsubscribe', { name: title })}</p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  className="rounded border border-gray-300 px-4 py-2 small"
                  onClick={handleConfirmCancel}
                >
                  {t('buttons.cancel')}
                </button>
                <button
                  className="rounded bg-blue-500 px-4 py-2 small text-white"
                  onClick={handleConfirmSuccess}
                >
                  {t('buttons.apply')}
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
        <button
          className="rounded border border-gray-300 px-4 py-2 large text-gray-500 uppercase"
          onClick={remove}
        >
          {t('personal.unsubscribe')}
        </button>
      </div>
    </div>
  );
};
