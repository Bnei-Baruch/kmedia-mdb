import React, { useEffect, useMemo, useState } from 'react';

import { withNamespaces } from 'react-i18next';
import WipErr from '../../../shared/WipErr/WipErr';
import UnitPage from '../../../Pages/Unit/Page';
import { NO_COLLECTION_VIEW_TYPE } from '../../../../helpers/consts';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors } from '../../../../redux/modules/mdb';
import PlaylistCollectionContainer from '../../../Pages/PlaylistCollection/Container';

const LessonPage = ({ t }) => {
  const { id }                        = useParams();
  const unit                          = useSelector(state => selectors.getDenormContentUnit(state.mdb, id));
  const wip                           = useSelector(state => selectors.getWip(state.mdb).units[id]);
  const err                           = useSelector(state => selectors.getErrors(state.mdb).units[id]);
  //fix bug with unit without collection
  const [needToFetch, setNeedToFetch] = useState();

  const dispatch = useDispatch();

  useEffect(() => {
    setNeedToFetch(!unit || Object.keys(unit.collections).length === 0);
  }, [id]);

  useEffect(() => {
    if (!wip && !err && needToFetch) {
      dispatch(actions.fetchUnit(id));
      setNeedToFetch(false);
    }
  }, [dispatch, err, id, wip, needToFetch]);

  const wipErr = WipErr({ wip, err, t });
  if (wipErr) {
    return wipErr;
  }

  if (!unit) {
    return null;
  }

  if (!unit?.collections) {
    return <UnitPage section="lessons" />;
  }

  let c;
  for (const _c in unit.collections) {
    if (NO_COLLECTION_VIEW_TYPE.includes(unit.collections[_c].content_type)) {
      c = unit.collections[_c];
      break;
    }
  }

  if (!c) {
    return <UnitPage section="lessons" />;
  }

  return <PlaylistCollectionContainer cId={c.id} cuId={id} />;
};

export default withNamespaces()(LessonPage);
