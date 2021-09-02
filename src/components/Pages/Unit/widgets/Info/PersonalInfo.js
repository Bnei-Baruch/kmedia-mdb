import React, { useEffect, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Confirm, Icon, Menu, Modal } from 'semantic-ui-react';

import {
  CT_SUBSCRIBE_BY_COLLECTION,
  CT_SUBSCRIBE_BY_TYPE,
  MY_NAMESPACE_LIKES,
  MY_NAMESPACE_SUBSCRIPTIONS
} from '../../../../../helpers/consts';
import * as shapes from '../../../../shapes';
import { selectors } from '../../../../../redux/modules/auth';
import { actions, selectors as myselector } from '../../../../../redux/modules/my';
import PlaylistInfo from './PlaylistInfo';
import AlertModal from '../../../../shared/AlertModal';
import NeedToLogin from '../../../../Sections/Personal/NeedToLogin';

const PersonalInfo = ({ unit = {}, t, collection }) => {
  const [alertMsg, setAlertMsg] = useState();
  const [confirm, setConfirm]   = useState();
  const [isNeedLogin, setIsNeedLogin]   = useState();

  const dispatch = useDispatch();
  const user     = useSelector(state => selectors.getUser(state.auth));

  const { collections, content_type: type, id } = unit;

  const likeCount = useSelector(state => myselector.getLikeCount(state.my));
  const like      = useSelector(state => myselector.getItemByCU(state.my, MY_NAMESPACE_LIKES, id));

  const subsByType = CT_SUBSCRIBE_BY_TYPE.includes(type) ? type : null;
  const cId        = collection?.id || collections && Object.values(collections)[0]?.id;
  const subsByCO   = CT_SUBSCRIBE_BY_COLLECTION.includes(type) ? cId : null;
  const sub        = useSelector(state => myselector.getItemByCU(state.my, MY_NAMESPACE_SUBSCRIPTIONS, id));

  useEffect(() => {
    if (id) {
      dispatch(actions.fetchByCU(MY_NAMESPACE_LIKES, { 'uids': [id] }));
      dispatch(actions.fetchByCU(MY_NAMESPACE_SUBSCRIPTIONS, { 'uids': [id] }));
      dispatch(actions.likeCount({ 'uids': [id] }));
    }
  }, [dispatch, id, user]);

  if (!unit) return null;

  const needToLogin = () => setAlertMsg(t('personal.youNeedLogin'));

  const likeDislike = (l) => {
    if (!user)
      return setIsNeedLogin(true);

    if (l)
      dispatch(actions.remove(MY_NAMESPACE_LIKES, { ids: [l.id] }));
    else
      dispatch(actions.add(MY_NAMESPACE_LIKES, { uids: [id] }));
    return null;
  };

  const subsUnsubs = (s) => {
    if (!user)
      return setIsNeedLogin(true);
    let msg;
    if (s) {
      setConfirm(true);
    } else {
      dispatch(actions.add(MY_NAMESPACE_SUBSCRIPTIONS, {
        collections: [subsByCO],
        types: [subsByType],
        content_unit_uid: id
      }));
      msg = t('personal.subscribeSuccessful');
    }
    setAlertMsg(msg);
    return null;
  };

  const onAlertCloseHandler = () => setAlertMsg(null);

  const handleConfirmCancel = () => setConfirm(false);

  const handleConfirmSuccess = () => {
    dispatch(actions.remove(MY_NAMESPACE_SUBSCRIPTIONS, { ids: [sub.id] }));
    setConfirm(false);
  };

  const subBtn = subsByType || subsByCO ? (
    <Menu.Item>
      <Confirm
        size="tiny"
        open={confirm}
        onCancel={handleConfirmCancel}
        onConfirm={handleConfirmSuccess}
        content={t('personal.confirmUnsubscribe')}
      />
      <Button
        primary={!sub}
        size={'tiny'}
        onClick={() => subsUnsubs(sub)}
        content={t(`personal.${!sub ? 'subscribe' : 'unsubscribe'}`)}
      />
    </Menu.Item>) : null;

  return (
    <>
      <Modal
        closeIcon
        open={isNeedLogin}
        onClose={()=>setIsNeedLogin(false)}
        onOpen={()=>setIsNeedLogin(true)}
      >
        <Modal.Content>
          <NeedToLogin>
            <div>For use this action</div>
          </NeedToLogin>
        </Modal.Content>
      </Modal>
      <Menu secondary floated="right">
        <AlertModal message={alertMsg} open={!!alertMsg} onClose={onAlertCloseHandler} />
        <Menu.Item fitted="horizontally">
          <PlaylistInfo cuID={unit.id} t={t} />
        </Menu.Item>
        <Menu.Item fitted="horizontally">
          <Button
            basic
            className="clear_button"
            onClick={() => likeDislike(like)}
          >
            <Icon name={`heart${!like ? ' outline' : ''}`} className="margin-right-4 margin-left-4" />
          </Button>
          <span>{likeCount}</span>
        </Menu.Item>
        {subBtn}
      </Menu>
    </>
  );
};

PersonalInfo.propTypes = {
  unit: shapes.ContentUnit,
  collection: shapes.Collection,

};

export default withNamespaces()(PersonalInfo);
