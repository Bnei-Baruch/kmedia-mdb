import PropTypes from 'prop-types';
import React, { useEffect, useMemo } from 'react';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { isEmpty } from '../../../helpers/utils';
import { actions, selectors } from '../../../redux/modules/mdb';
import { actions as recommended } from '../../../redux/modules/recommended';
import WipErr from '../../shared/WipErr/WipErr';
import Page from './Page';

const PlaylistCollectionContainer = ({ cId, t, cuId }) => {
  const collection = useSelector(state => selectors.getDenormCollectionWUnits(state.mdb, cId), shallowEqual);
  const wipMap     = useSelector(state => selectors.getWip(state.mdb), shallowEqual);
  const errorMap   = useSelector(state => selectors.getErrors(state.mdb), shallowEqual);

  const { cuIDs, content_units } = collection || false;

  const dispatch = useDispatch();

  // Fetch units files if needed.
  const cusForFetch = useMemo(() => cuIDs?.filter(id => {
    if (wipMap.units[id] || errorMap.units[id])
      return false;

    const cu = content_units.find(x => x.id === id);
    return !cu?.files;
  }) || [], [cuIDs, wipMap.units, errorMap.units, content_units]);

  useEffect(() => {
    if (cusForFetch?.length > 0) {
      dispatch(actions.fetchUnitsByIDs({ id: cusForFetch, with_files: true }));
    }
  }, [dispatch, cusForFetch]);

  useEffect(() => {
    if (!Object.prototype.hasOwnProperty.call(wipMap.collections, cId)) {
      // never fetched as full so fetch now
      dispatch(actions.fetchCollection(cId));
    }
  }, [cId, dispatch, wipMap.collections]);

  useEffect(() => {
    if (cuIDs)
      dispatch(recommended.fetchViews(cuIDs));
  }, [cuIDs, dispatch]);

  if (!cId || !collection || isEmpty(content_units)) {
    return null;
  }

  // We're wip / err if some request is wip / err
  const wip = wipMap.collections[cId] || cusForFetch.length !== 0 || cuIDs.some(id => wipMap.units[id]);
  let err   = errorMap.collections[cId];
  if (!err) {
    const cuIDwithError = cuIDs?.find(cuID => errorMap.units[cuID]);
    err                 = cuIDwithError ? errorMap.units[cuIDwithError] : null;
  }

  const wipErr = WipErr({ wip, err, t });
  if (wipErr) {
    return wipErr;
  }

  return (
    <Page
      cuId={cuId}
      collection={collection}
    />
  );
};

PlaylistCollectionContainer.propTypes = {
  cId: PropTypes.string.isRequired,
  cuId: PropTypes.string,
  t: PropTypes.func.isRequired
};

const areEqual = (prevProps, nextProps) =>
  ((!prevProps.cId && !nextProps.cId) || prevProps.cId === nextProps.cId)
  && ((!prevProps.cuId && !nextProps.cuId) || prevProps.cuId === nextProps.cuId);

export default React.memo(withTranslation()(PlaylistCollectionContainer), areEqual);
