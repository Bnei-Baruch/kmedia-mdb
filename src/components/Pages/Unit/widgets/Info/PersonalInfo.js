import React, { useEffect, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Icon, Menu, Modal } from 'semantic-ui-react';

import { selectors } from '../../../../../redux/modules/auth';
import { actions, selectors as my } from '../../../../../redux/modules/my';
import {
  MY_NAMESPACE_HISTORY,
  MY_NAMESPACE_REACTIONS,
  MY_NAMESPACE_SUBSCRIPTIONS,
  MY_REACTION_KINDS
} from '../../../../../helpers/consts';
import { getMyItemKey } from '../../../../../helpers/my';
import SubscribeBtn from '../../../../shared/SubscribeBtn';
import * as shapes from '../../../../shapes';
import NeedToLogin from '../../../../Sections/Personal/NeedToLogin';
import PlaylistInfo from './PlaylistInfo';

const PersonalInfo = ({ unit = {}, t, collection }) => {
  const [isNeedLogin, setIsNeedLogin] = useState();

  const { id, content_type } = unit;
  const likeParams           = {
    kind: MY_REACTION_KINDS.LIKE,
    subject_type: content_type,
    subject_uid: id
  };

  const user           = useSelector(state => selectors.getUser(state.auth));
  const reactionsCount = useSelector(state => my.getReactionsCount(state.my, MY_REACTION_KINDS.LIKE));

  const { key }  = getMyItemKey(MY_NAMESPACE_REACTIONS, likeParams);
  const reaction = useSelector(state => my.getItemByKey(state.my, MY_NAMESPACE_REACTIONS, key));
  const deleted  = useSelector(state => my.getDeleted(state.my, MY_NAMESPACE_REACTIONS));

  const dispatch = useDispatch();
  useEffect(() => {
    if (key && !reaction) {
      dispatch(actions.fetch(MY_NAMESPACE_REACTIONS, likeParams));
    }
    dispatch(actions.reactionsCount({ 'uids': [id] }));
  }, [dispatch, user, key]);

  useEffect(() => {
    deleted && dispatch(actions.setDeleted(MY_NAMESPACE_REACTIONS, false));
  }, [deleted]);

  if (!unit) return null;

  const toggleReaction = l => {
    if (!user)
      return setIsNeedLogin(true);
    if (l)
      dispatch(actions.remove(MY_NAMESPACE_REACTIONS, likeParams));
    else
      dispatch(actions.add(MY_NAMESPACE_REACTIONS, likeParams));
    return null;
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
        <Menu.Item>
          <Button
            basic
            className="clear_button"
            onClick={() => toggleReaction(reaction)}
          >
            <Icon name={`heart${!reaction ? ' outline' : ''}`} className="margin-right-4 margin-left-4" />
            <span>{reactionsCount}</span>
          </Button>
        </Menu.Item>
        <Menu.Item>
          <PlaylistInfo cuID={unit.id} t={t} />
        </Menu.Item>
        <Menu.Item>
          <SubscribeBtn collection={collection} unit={unit} />
        </Menu.Item>
      </Menu>
    </>
  );
};

PersonalInfo.propTypes = {
  unit: shapes.ContentUnit,
  collection: shapes.Collection,

};

const areEqual = (prevProps, nextProps) => {
  return nextProps.unit && prevProps.unit?.id === nextProps.unit.id;
};

export default React.memo(withNamespaces()(PersonalInfo), areEqual);
