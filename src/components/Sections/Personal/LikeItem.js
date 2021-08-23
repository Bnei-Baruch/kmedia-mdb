import React from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'semantic-ui-react';

import { actions } from '../../../redux/modules/my';
import { MY_NAMESPACE_LIKES } from '../../../helpers/consts';
import CUItem from '../../shared/CUItem';

export const LikeItem = ({ data: { item: like}}) => {
  const dispatch = useDispatch();

  const likeDislike = () => {
    if (like)
      dispatch(actions.remove(MY_NAMESPACE_LIKES, { ids: [like.id] }));
    else
      dispatch(actions.add(MY_NAMESPACE_LIKES, { uids: [like.content_unit_uid] }));
  };

  return (
    <CUItem id={like.content_unit_uid}>
     {/* <Button
        basic
        floated="right"
        size="medium"
        icon="like"
        onClick={likeDislike}
        className="no-margin"
      />*/}
    </CUItem>
  );
};
