import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog } from '@headlessui/react';

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <Dialog
        open={!!isNeedLogin}
        onClose={() => setIsNeedLogin(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative">
            <button
              className="absolute top-2 right-2"
              onClick={() => setIsNeedLogin(false)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <NeedToLogin />
          </Dialog.Panel>
        </div>
      </Dialog>
      <div className="personal_info no_print">
        <div className="item">
          <TaggingBtn />
        </div>
        <div className="item">
          <button
            className="clear_button"
            onClick={() => toggleReaction(reaction)}
          >
            <span className="material-symbols-outlined margin-right-4 margin-left-4">{reaction ? 'favorite' : 'favorite_border'}</span>
            <span>{reactionsCount}</span>
          </button>
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
