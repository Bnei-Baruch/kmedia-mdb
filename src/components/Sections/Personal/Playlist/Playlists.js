import React, { useEffect } from 'react';
import { actions, selectors } from '../../../../redux/modules/my';
import { useDispatch, useSelector } from 'react-redux';
import { selectors as mdb } from '../../../../redux/modules/mdb';
import Template from '../helper';
import WipErr from '../../../shared/WipErr/WipErr';
import { withNamespaces } from 'react-i18next';
import { MY_NAMESPACE_PLAYLISTS } from '../../../../helpers/consts';
import { PlaylistItem } from './PlaylistItem';

const Playlists = ({ pageSize = 8, pageNo = 1, t, namespace }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetch(namespace, { page_no: pageNo, page_size: pageSize }));
  }, [dispatch, pageNo, pageSize]);

  const hs  = useSelector(state => selectors.getItems(state.my, namespace));
  const err = useSelector(state => selectors.getErr(state.my, namespace));
  const wip = useSelector(state => selectors.getWIP(state.my, namespace));

  const denormItems = hs => state => {
    if (!Array.isArray(hs)) return [];
    return hs.map(x => {
      const unit = mdb.getDenormContentUnit(state.mdb, x.content_unit_uid);
      return { mdbItem: unit, item: x };
    });
  };

  const items = useSelector(denormItems(hs));

  if (wip || err || items.length === 0) return WipErr({ wip, err, t });

  return (
    <Template namespace={MY_NAMESPACE_PLAYLISTS}>
      {items.map(d => <PlaylistItem data={d} key={d.mdbItem.id} t={t} />)}
    </Template>
  );
};

export default withNamespaces()(Playlists);
