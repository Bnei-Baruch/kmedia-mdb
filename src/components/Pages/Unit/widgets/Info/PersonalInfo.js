import React, { useEffect, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';

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

const PersonalInfo = ({ unit = {}, t, collection }) => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg]   = useState();

  const dispatch = useDispatch();
  const user     = useSelector(state => selectors.getUser(state.auth));

  const { collections, content_type: type, id } = unit;

  const likeCount = useSelector(state => myselector.getLikeCount(state.my));
  const likes     = useSelector(state => myselector.getItems(state.my, MY_NAMESPACE_LIKES));
  const like      = likes?.find(l => l.content_unit_uid === id);

  const subsByType = CT_SUBSCRIBE_BY_TYPE.includes(type) ? type : null;
  const cId        = collection?.id || collections && Object.values(collections)[0]?.id;
  const subsByCO   = CT_SUBSCRIBE_BY_COLLECTION.includes(type) ? cId : null;
  const subs       = useSelector(state => myselector.getItems(state.my, MY_NAMESPACE_SUBSCRIPTIONS));
  const sub        = subs?.find(l => subsByCO && l.collection_uid === subsByCO || subsByType && l.content_type === subsByType);

  useEffect(() => {
    if (id) {
      dispatch(actions.fetch(MY_NAMESPACE_LIKES, { 'uids': [id] }));
      dispatch(actions.fetch(MY_NAMESPACE_SUBSCRIPTIONS, { 'uids': [id] }));
      dispatch(actions.likeCount({ 'uids': [id] }));
    }
  }, [dispatch, id, user]);

  const needToLogin = () => {
    alert('you need to login');
  };

  const likeDislike = (l) => {
    // if (!user) return needToLogin();

    if (l)
      dispatch(actions.remove(MY_NAMESPACE_LIKES, { ids: [l.id] }));
    else
      dispatch(actions.add(MY_NAMESPACE_LIKES, { uids: [id] }));

    return null;
  };

  const subsUnsubs = (s) => {
    //if (!user) return needToLogin();
    let msg;
    if (s) {
      dispatch(actions.remove(MY_NAMESPACE_SUBSCRIPTIONS, { ids: [s.id] }));
      msg = t('personal.unsubscribeSuccessful');
    } else {
      dispatch(actions.add(MY_NAMESPACE_SUBSCRIPTIONS, {
        collections: [subsByCO],
        types: [subsByType],
        content_unit_uid: id
      }));
      msg = t('personal.subscribeSuccessful');
    }
    setAlertOpen(true);
    setAlertMsg(msg);
    return null;
  };

  const onAlertCloseHandler = () => {
    setAlertOpen(false);
    setAlertMsg('');
  };

  const subBtn = subsByType || subsByCO ? (
    <Button
      primary
      size={'tiny'}
      onClick={() => subsUnsubs(sub)}
      content={t(`personal.${!sub ? 'subscribe' : 'unsubscribe'}`)}
    />) : null;

  return (
    <div>
      <AlertModal message={alertMsg} open={alertOpen} onClose={onAlertCloseHandler} />
      {subBtn}
      <span className="margin-right-8 margin-left-8">
      <Icon
        size={'big'}
        onClick={() => likeDislike(like)}
        name={`heart ${!like ? 'outline' : ''}`}
      />
        <span>{likeCount}</span>
      </span>

      <PlaylistInfo unit={unit} user={user} t={t} />
    </div>
  );
};

PersonalInfo.propTypes = {
  unit: shapes.ContentUnit,
  collection: shapes.Collection,

};

export default withNamespaces()(PersonalInfo);
