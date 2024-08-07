import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Icon, Modal } from 'semantic-ui-react';

import { actions } from '../../../../../redux/modules/my';
import { MY_NAMESPACE_REACTIONS, MY_REACTION_KINDS } from '../../../../../helpers/consts';
import { getMyItemKey } from '../../../../../helpers/my';
import SubscribeBtn from '../../../../shared/SubscribeBtn';
import * as shapes from '../../../../shapes';
import NeedToLogin from '../../../../Sections/Personal/NeedToLogin';
import { TaggingBtn } from './TaggingBtn';
import { ToPlaylistBtn } from './ToPlaylistBtn';
import {
  myGetDeletedSelector,
  mdbGetDenormContentUnitSelector,
  playlistGetInfoSelector,
  myGetReactionsCountSelector,
  authGetUserSelector,
  myGetItemByKeySelector
} from '../../../../../redux/selectors';

const PersonalInfo = ({ collection }) => {
  const [isNeedLogin, setIsNeedLogin] = useState();

  const { cuId }             = useSelector(playlistGetInfoSelector);
  const cu                   = useSelector(state => mdbGetDenormContentUnitSelector(state, cuId));
  const { id, content_type } = cu || {};
  const likeParams           = {
    kind: MY_REACTION_KINDS.LIKE,
    subject_type: content_type,
    subject_uid: id
  };

  const { key } = getMyItemKey(MY_NAMESPACE_REACTIONS, likeParams);

  const user           = useSelector(authGetUserSelector);
  const reactionsCount = useSelector(state => myGetReactionsCountSelector(state, key));
  const reaction       = useSelector(state => myGetItemByKeySelector(state, MY_NAMESPACE_REACTIONS, key));
  const deleted        = useSelector(state => myGetDeletedSelector(state, MY_NAMESPACE_REACTIONS));

  const dispatch = useDispatch();
  useEffect(() => {
    if (key && !reaction) {
      dispatch(actions.fetch(MY_NAMESPACE_REACTIONS, { addToList: false, ...likeParams }));
    }

    if (id !== undefined) {
      dispatch(actions.reactionsCount({ 'uids': [id], type: content_type }));
    }
  }, [dispatch, key, id, content_type]);

  useEffect(() => {
    deleted && dispatch(actions.setDeleted(MY_NAMESPACE_REACTIONS, false));
  }, [deleted, dispatch]);

  const toggleReaction = l => {
    if (!user)
      return setIsNeedLogin(true);
    if (l)
      dispatch(actions.remove(MY_NAMESPACE_REACTIONS, { ...likeParams, key }));
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
      <div className="personal_info no_print">
        <div className="item">
          <TaggingBtn />
        </div>
        <div className="item">
          <Button
            basic
            className="clear_button"
            onClick={() => toggleReaction(reaction)}
          >
            <Icon name={`heart${!reaction ? ' outline' : ''}`} className="margin-right-4 margin-left-4" />
            <span>{reactionsCount}</span>
          </Button>
        </div>
        <div className="item">
          <ToPlaylistBtn />
        </div>
        <div className="item">
          <SubscribeBtn collection={collection} />
        </div>
      </div>
    </>
  );
};

PersonalInfo.propTypes = {
  collection: shapes.Collection
};

export default withTranslation()(PersonalInfo);
