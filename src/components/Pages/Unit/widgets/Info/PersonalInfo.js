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
import AlertModal from '../../../../shared/AlertModal';
import NeedToLogin from '../../../../Sections/Personal/NeedToLogin';
import PlaylistInfo from './PlaylistInfo';

const PersonalInfo = ({ unit = {}, t, collection }) => {
  const [alertMsg, setAlertMsg]       = useState();
  const [confirm, setConfirm]         = useState();
  const [isNeedLogin, setIsNeedLogin] = useState();

  const dispatch = useDispatch();
  const user     = useSelector(state => selectors.getUser(state.auth));

  const { collections, content_type: type, id } = unit;

  const likeCount = useSelector(state => myselector.getLikeCount(state.my));
  const like      = useSelector(state => myselector.getItemByCU(state.my, MY_NAMESPACE_LIKES, id));

  const subsByType = CT_SUBSCRIBE_BY_TYPE.includes(type) ? type : null;
  const cId        = collection?.id || (collections && Object.values(collections)[0]?.id);
  const subsByCO   = CT_SUBSCRIBE_BY_COLLECTION.includes(type) ? cId : null;

  const subs = useSelector(state => myselector.getItems(state.my, MY_NAMESPACE_SUBSCRIPTIONS));

  let sub, title;
  if (subsByCO) {
    sub   = subs.find(s => subsByCO === s.collection_uid);
    title = collection?.name;
  } else if (subsByType) {
    sub   = subs.find(s => subsByType === s.content_type);
    title = t(`constants.content-types.${subsByType}`);
  }

  useEffect(() => {
    if (id) {
      dispatch(actions.fetchByCU(MY_NAMESPACE_LIKES, { 'uids': [id] }));
      dispatch(actions.likeCount({ 'uids': [id] }));
    }

    if (subsByType || subsByCO) {
      dispatch(actions.fetch(MY_NAMESPACE_SUBSCRIPTIONS, { 'collections': [subsByCO], 'types': [subsByType] }));
    }
  }, [dispatch, id, user, subsByCO, subsByType]);

  if (!unit) return null;

  const likeDislike = l => {
    if (!user)
      return setIsNeedLogin(true);

    if (l)
      dispatch(actions.remove(MY_NAMESPACE_LIKES, { ids: [l.id] }));
    else
      dispatch(actions.add(MY_NAMESPACE_LIKES, { uids: [id] }));
    return null;
  };

  const subsUnsubs = s => {
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

  const renderSubBtn = () => {
    if (!subsByType && !subsByCO) return null;
    return (
      <Menu.Item fitted="horizontally">
        <Confirm
          size="tiny"
          open={confirm}
          onCancel={handleConfirmCancel}
          onConfirm={handleConfirmSuccess}
          content={t('personal.confirmUnsubscribe', { name: title })}
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
      </Menu.Item>
    );
  };

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
      <Menu secondary className="personal_info">
        <AlertModal message={alertMsg} open={!!alertMsg} onClose={onAlertCloseHandler} />
        <Menu.Item>
          <Button
            basic
            className="clear_button"
            onClick={() => likeDislike(like)}
          >
            <Icon name={`heart${!like ? ' outline' : ''}`} className="margin-right-4 margin-left-4" />
            <span>{likeCount}</span>
          </Button>
        </Menu.Item>
        <Menu.Item>
          <PlaylistInfo cuID={unit.id} t={t} />
        </Menu.Item>
        {renderSubBtn()}
      </Menu>
    </>
  );
};

PersonalInfo.propTypes = {
  unit: shapes.ContentUnit,
  collection: shapes.Collection,

};

export default withNamespaces()(PersonalInfo);
