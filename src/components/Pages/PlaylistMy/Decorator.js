import React from 'react';
import { useParams, withRouter } from 'react-router-dom';

import { MY_NAMESPACE_LIKES } from '../../../helpers/consts';
import PlaylistLikeContainer from './ContainerLike';
import PlaylistMyContainer from './Container';

const PlaylistDecorator = () => {
  const { id } = useParams();
  return id === MY_NAMESPACE_LIKES ? <PlaylistLikeContainer /> : <PlaylistMyContainer id={id} />;
};

export default withRouter(PlaylistDecorator);
