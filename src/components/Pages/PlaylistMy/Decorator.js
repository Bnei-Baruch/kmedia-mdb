import React from 'react';
import { useParams, withRouter } from 'react-router-dom';

import { MY_NAMESPACE_REACTIONS } from '../../../helpers/consts';
import PlaylistReactionContainer from './ContainerReaction';
import PlaylistMyContainer from './Container';

const PlaylistDecorator = () => {
  const { id } = useParams();
  return id === MY_NAMESPACE_REACTIONS ? <PlaylistReactionContainer /> : <PlaylistMyContainer id={id} />;
};

export default withRouter(PlaylistDecorator);
