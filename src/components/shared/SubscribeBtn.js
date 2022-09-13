import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Confirm, Modal } from 'semantic-ui-react';

import {
  CT_SUBSCRIBE_BY_COLLECTION,
  CT_SUBSCRIBE_BY_TYPE,
  MY_NAMESPACE_SUBSCRIPTIONS
} from '../../helpers/consts';
import * as shapes from '../shapes';
import { selectors } from '../../redux/modules/auth';
import { actions, selectors as myselector } from '../../redux/modules/my';
import AlertModal from './AlertModal';
import NeedToLogin from '../Sections/Personal/NeedToLogin';
import { getMyItemKey } from '../../helpers/my';
import { selectors as settings } from '../../redux/modules/settings';
import { getLanguageDirection } from '../../helpers/i18n-utils';

const SubscribeBtn = ({ unit = {}, t, collection }) => {
  const [alertMsg, setAlertMsg]       = useState();
  const [confirm, setConfirm]         = useState();
  const [isNeedLogin, setIsNeedLogin] = useState();

  const dispatch = useDispatch();
  const user     = useSelector(state => selectors.getUser(state.auth));

  const { collections, content_type: type, id } = unit;

  const subsByType = CT_SUBSCRIBE_BY_TYPE.includes(type) ? type : null;
  const cId        = collection?.id || (collections && Object.values(collections)[0]?.id);
  const subsByCO   = !type || CT_SUBSCRIBE_BY_COLLECTION.includes(type) ? cId : null;

  const subParams = { 'collection_uid': subsByCO, 'content_type': subsByType, 'content_unit_uid': id };
  const { key }   = getMyItemKey(MY_NAMESPACE_SUBSCRIPTIONS, subParams);
  const sub       = useSelector(state => myselector.getItemByKey(state.my, MY_NAMESPACE_SUBSCRIPTIONS, key));

  const language = useSelector(state => settings.getLanguage(state.settings));
  const dir      = getLanguageDirection(language);

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
  }, [dispatch, key, sub, subsByType, subsByCO]);

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
      <Modal
        closeIcon
        open={isNeedLogin}
        onClose={() => setIsNeedLogin(false)}
        onOpen={() => setIsNeedLogin(true)}
      >
        <Modal.Content>
          <NeedToLogin />
        </Modal.Content>
      </Modal>
      <AlertModal message={alertMsg} open={!!alertMsg} onClose={onAlertCloseHandler} />
      <Confirm
        size="tiny"
        open={confirm}
        onCancel={handleConfirmCancel}
        onConfirm={handleConfirmSuccess}
        cancelButton={t('buttons.cancel')}
        confirmButton={t('buttons.apply')}
        content={t('personal.confirmUnsubscribe', { name: title })}
        dir={dir}
      />
      <Button
        basic
        color={!sub ? 'blue' : 'grey'}
        onClick={() => subsUnsubs(sub)}
        content={t(`personal.${!sub ? 'subscribe' : 'unsubscribe'}`)}
        className="uppercase  margin-right-4 margin-left-4"
        compact
        style={{ fontSize: '0.9em' }}
      />
    </>
  );
};

SubscribeBtn.propTypes = {
  unit: shapes.ContentUnit,
  collection: shapes.Collection,

};

export default withTranslation()(SubscribeBtn);
