import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import { actions, selectors } from '../../../redux/modules/my';
import WipErr from '../../shared/WipErr/WipErr';
import Page from './Page';
import { MY_NAMESPACE_PLAYLIST_ITEMS } from '../../../helpers/consts';
import { useParams } from 'react-router-dom';

const PlaylistMyContainer = ({ t }) => {
  const { id: pId }   = useParams();
  const playlistItems = useSelector(state => selectors.getItems(state.my, MY_NAMESPACE_PLAYLIST_ITEMS));//.filter(x => x.playlist_id === pId) || [];
  const wip           = useSelector(state => selectors.getWIP(state.my, MY_NAMESPACE_PLAYLIST_ITEMS));
  const err           = useSelector(state => selectors.getErr(state.my, MY_NAMESPACE_PLAYLIST_ITEMS));

  const dispatch = useDispatch();
  useEffect(() => {
    pId && dispatch(actions.fetch(MY_NAMESPACE_PLAYLIST_ITEMS, { id: pId }));
  }, [pId]);

  const wipErr = WipErr({ wip, err, t });
  if (wipErr) {
    return wipErr;
  }

  return (
    <Page
      pId={pId}
      playlistItems={playlistItems}
    />
  );
};

const areEqual = (prevProps, nextProps) =>
  (prevProps.pId === nextProps.pId) && (prevProps.cuId === nextProps.cuId);

export default React.memo(withNamespaces()(PlaylistMyContainer), areEqual);
