import React, { useEffect } from 'react';

import { withNamespaces } from 'react-i18next';
import WipErr from '../../../shared/WipErr/WipErr';
import UnitPage from '../../../Pages/Unit/Page';
import { COLLECTION_LESSONS_TYPE } from '../../../../helpers/consts';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors } from '../../../../redux/modules/mdb';
import PlaylistCollectionContainer from '../../../Pages/PlaylistCollection/Container';

const LessonPage = ({ t }) => {
  const { id } = useParams();
  const unit   = useSelector(state => selectors.getDenormContentUnit(state.mdb, id));
  const wip    = useSelector(state => selectors.getWip(state.mdb).units[id]);
  const err    = useSelector(state => selectors.getErrors(state.mdb).units[id]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!wip && !err && !unit && unit.id !== id) {
      dispatch(actions.fetchUnit(id));
    }
  }, [dispatch, err, id, unit, wip]);

  const wipErr = WipErr({ wip, err, t });
  if (wipErr) {
    return wipErr;
  }

  if (!unit) {
    return null;
  }

  if (!unit?.collections)
    return <UnitPage section="lessons" />;

  let c;
  for (const _c in unit.collections) {
    if (COLLECTION_LESSONS_TYPE.includes(unit.collections[_c].content_type)) {
      c = unit.collections[_c];
      break;
    }
  }

  if (!c)
    return <UnitPage section="lessons" />;

  return <PlaylistCollectionContainer cId={c.id} cuId={id} />;
};

export default withNamespaces()(LessonPage);
