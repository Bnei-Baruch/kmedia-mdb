import React, { useEffect, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Icon, Menu, Modal } from 'semantic-ui-react';

import { MY_NAMESPACE_LIKES } from '../../../../../helpers/consts';
import * as shapes from '../../../../shapes';
import { selectors } from '../../../../../redux/modules/auth';
import { actions, selectors as myselector } from '../../../../../redux/modules/my';
import NeedToLogin from '../../../../Sections/Personal/NeedToLogin';
import PlaylistInfo from './PlaylistInfo';
import SubscribeBtn from '../../../../shared/SubscribeBtn';

const PersonalInfo = ({ unit = {}, t, collection }) => {
  const [isNeedLogin, setIsNeedLogin] = useState();

  const dispatch = useDispatch();
  const user     = useSelector(state => selectors.getUser(state.auth));

  const { id } = unit;

  const likeCount = useSelector(state => myselector.getLikeCount(state.my));
  const like      = useSelector(state => myselector.getItemByCU(state.my, MY_NAMESPACE_LIKES, id));

  useEffect(() => {
    if (id) {
      dispatch(actions.fetchByCU(MY_NAMESPACE_LIKES, { 'uids': [id] }));
      dispatch(actions.likeCount({ 'uids': [id] }));
    }
  }, [dispatch, id, user]);

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
            onClick={() => likeDislike(like)}
          >
            <Icon name={`heart${!like ? ' outline' : ''}`} className="margin-right-4 margin-left-4" />
            <span>{likeCount}</span>
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

export default withNamespaces()(PersonalInfo);
