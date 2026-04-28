import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogPanel } from '@headlessui/react';

import { CT_SUBSCRIBE_BY_COLLECTION, CT_SUBSCRIBE_BY_TYPE, MY_NAMESPACE_SUBSCRIPTIONS } from '../../helpers/consts';
import * as shapes from '../shapes';
import { actions } from '../../redux/modules/my';
import AlertModal from './AlertModal';
import NeedToLogin from '../Sections/Personal/NeedToLogin';
import { getMyItemKey } from '../../helpers/my';
import {
  mdbGetDenormContentUnitSelector,
  playlistGetInfoSelector,
  myGetItemByKeySelector,
  settingsGetUIDirSelector,
  authGetUserSelector
} from '../../redux/selectors';

const SubscribeBtn = ({ collection }) => {
  const { t } = useTranslation();
  const [alertMsg, setAlertMsg]       = useState();
  const [confirm, setConfirm]         = useState();
  const [isNeedLogin, setIsNeedLogin] = useState();

  const dispatch = useDispatch();
  const user     = useSelector(authGetUserSelector);

  const { cuId }                                = useSelector(playlistGetInfoSelector);
  const { collections, content_type: type, id } = useSelector(state => mdbGetDenormContentUnitSelector(state, cuId)) || {};

  const subsByType = CT_SUBSCRIBE_BY_TYPE.includes(type) ? type : null;
  const cId        = collection?.id || (collections && Object.values(collections)[0]?.id);

  const subsByCO  = !type || CT_SUBSCRIBE_BY_COLLECTION.includes(type) ? cId : null;
  const subParams = useMemo(() => ({
    'collection_uid'  : subsByCO,
    'content_type'    : subsByType,
    'content_unit_uid': id
  }), [subsByCO, subsByType, id]);
  const { key }   = getMyItemKey(MY_NAMESPACE_SUBSCRIPTIONS, subParams);

  const sub = useSelector(state => myGetItemByKeySelector(state, MY_NAMESPACE_SUBSCRIPTIONS, key));
  const dir = useSelector(settingsGetUIDirSelector);

  let title;
  if (subsByCO) {
    title = collection?.name;
  } else if (subsByType) {
    title = t(`constants.content-types.${subsByType}`);
  }

  useEffect(() => {
    if (!sub && (subsByType || subsByCO)) {
      dispatch(actions.fetch(MY_NAMESPACE_SUBSCRIPTIONS, { addToList: false, ...subParams }));
    }
  }, [dispatch, key, sub, subsByType, subsByCO, subParams]);

  const subsUnsubs = s => {
    if (!user)
      return setIsNeedLogin(true);
    let msg;
    if (s) {
      setConfirm(true);
    } else {
      dispatch(actions.add(MY_NAMESPACE_SUBSCRIPTIONS, subParams));
      msg = t('personal.subscribeSuccessful');
    }

    setAlertMsg(msg);
    return null;
  };

  const onAlertCloseHandler = () => setAlertMsg(null);

  const handleConfirmCancel = () => setConfirm(false);

  const handleConfirmSuccess = () => {
    dispatch(actions.remove(MY_NAMESPACE_SUBSCRIPTIONS, { id: sub.id, key }));
    setConfirm(false);
  };

  if (!subsByType && !subsByCO) return null;

  return (
    <>
      <Dialog open={!!isNeedLogin} onClose={() => setIsNeedLogin(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="relative bg-white rounded-lg p-6 max-w-lg w-full shadow-xl">
            <button
              onClick={() => setIsNeedLogin(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <NeedToLogin />
          </DialogPanel>
        </div>
      </Dialog>
      <AlertModal message={alertMsg} open={!!alertMsg} onClose={onAlertCloseHandler} />
      <Dialog open={!!confirm} onClose={handleConfirmCancel} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl" dir={dir}>
            <p className="mb-4">{t('personal.confirmUnsubscribe', { name: title })}</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                onClick={handleConfirmCancel}
              >
                {t('buttons.cancel')}
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleConfirmSuccess}
              >
                {t('buttons.apply')}
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
      <button
        className={`uppercase border rounded px-3 py-1 ${!sub ? 'border-blue-500 text-blue-500 hover:bg-blue-50' : 'border-gray-400 text-gray-500 hover:bg-gray-50'}`}
        onClick={() => subsUnsubs(sub)}
        style={{ fontSize: '0.9em' }}
      >
        {t(`personal.${!sub ? 'subscribe' : 'unsubscribe'}`)}
      </button>
    </>
  );
};

SubscribeBtn.propTypes = {
  unit      : shapes.ContentUnit,
  collection: shapes.Collection

};

export default SubscribeBtn;
