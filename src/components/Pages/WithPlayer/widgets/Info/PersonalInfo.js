import React, { useEffect, useState } from 'react';
import { withTranslation } from 'next-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Icon, Menu, Modal } from 'semantic-ui-react';

import { selectors } from '../../../../../../lib/redux/slices/authSlice/authSlice';
import { mySlice, selectors as my } from '../../../../../../lib/redux/slices/mySlice/mySlice';
import { selectors as playlist } from '../../../../../../lib/redux/slices/playlistSlice/playlistSlice';
import { MY_NAMESPACE_REACTIONS, MY_REACTION_KINDS } from '../../../../../helpers/consts';
import { getMyItemKey } from '../../../../../helpers/my';
import SubscribeBtn from '../../../../shared/SubscribeBtn';
import * as shapes from '../../../../shapes';
import NeedToLogin from '../../../../Sections/Personal/NeedToLogin';
import { selectors as mdb } from '../../../../../../lib/redux/slices/mdbSlice/mdbSlice';
import { TaggingBtn } from './TaggingBtn';
import { ToPlaylistBtn } from './ToPlaylistBtn';
import { fetchMy, removeMy, reactionsCount } from '../../../../../../lib/redux/slices/mySlice/thunks';

const PersonalInfo = ({ collection }) => {
  const [isNeedLogin, setIsNeedLogin] = useState();

  const { cuId }             = useSelector(state => playlist.getInfo(state.playlist));
  const { id, content_type } = useSelector(state => mdb.getDenormContentUnit(state.mdb, cuId));
  const likeParams           = {
    kind: MY_REACTION_KINDS.LIKE,
    subject_type: content_type,
    subject_uid: id
  };

  const { key } = getMyItemKey(MY_NAMESPACE_REACTIONS, likeParams);

  const user             = useSelector(state => selectors.getUser(state.auth));
  const reactionsCounter = useSelector(state => my.getReactionsCount(state.my, key));
  const reaction         = useSelector(state => my.getItemByKey(state.my, MY_NAMESPACE_REACTIONS, key));
  const deleted          = useSelector(state => my.getDeleted(state.my, MY_NAMESPACE_REACTIONS));

  const dispatch = useDispatch();
  useEffect(() => {
    if (key && !reaction) {
      dispatch(fetchMy({ namespace: MY_NAMESPACE_REACTIONS, addToList: false, ...likeParams }));
    }

    dispatch(reactionsCount({ 'uids': [id], type: content_type }));
  }, [dispatch, key]);

  useEffect(() => {
    deleted && dispatch(mySlice.actions.setDeleted(MY_NAMESPACE_REACTIONS, false));
  }, [deleted, dispatch]);

  const toggleReaction = l => {
    if (!user)
      return setIsNeedLogin(true);
    if (l)
      dispatch(removeMy(MY_NAMESPACE_REACTIONS, { ...likeParams, key }));
    else
      dispatch(addMy(MY_NAMESPACE_REACTIONS, likeParams));
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
          <TaggingBtn />
        </Menu.Item>
        <Menu.Item>
          <Button
            basic
            className="clear_button"
            onClick={() => toggleReaction(reaction)}
          >
            <Icon name={`heart${!reaction ? ' outline' : ''}`} className="margin-right-4 margin-left-4" />
            <span>{reactionsCounter}</span>
          </Button>
        </Menu.Item>
        <Menu.Item>
          <ToPlaylistBtn />
        </Menu.Item>
        <Menu.Item>
          {/*<SubscribeBtn collection={collection} />*/}
        </Menu.Item>
      </Menu>
    </>
  );
};

PersonalInfo.propTypes = {
  collection: shapes.Collection,
};

export default withTranslation()(PersonalInfo);
