import isEqual from 'lodash/isEqual';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { COLLECTION_DAILY_LESSONS, DATE_FORMAT } from '../../../helpers/consts';
import { canonicalLink } from '../../../helpers/links';
import playerHelper from '../../../helpers/player';
import { isEmpty } from '../../../helpers/utils';

import { actions, selectors } from '../../../redux/modules/mdb';
import { actions as recommended } from '../../../redux/modules/recommended';
import WipErr from '../../shared/WipErr/WipErr';
import Page from './Page';

const PlaylistCollectionContainer = ({ cId, t, cuId }) => {
  const collection         = useSelector(state => selectors.getDenormCollectionWUnits(state.mdb, cId), shallowEqual);
  const wipMap             = useSelector(state => selectors.getWip(state.mdb), shallowEqual);
  const fullUnitFetchedMap = useSelector(state => selectors.getFullUnitFetched(state.mdb), shallowEqual);
  const errorMap           = useSelector(state => selectors.getErrors(state.mdb), shallowEqual);
  const cWindow            = useSelector(state => selectors.getWindow(state.mdb), shallowEqual);
  const collections        = useSelector(state => cWindow?.data?.map(id => selectors.getDenormCollection(state.mdb, id)).filter(c => !!c), shallowEqual);
  const location           = useLocation();

  const [nextLink, setNextLink] = useState(null);
  const [prevLink, setPrevLink] = useState(null);

  const { id, cuIDs, content_units, content_type, film_date } = collection || false;

  cuId = cuId || cuIDs?.[playerHelper.getActivePartFromQuery(location)];

  const dispatch = useDispatch();

  const fetchWindow = useCallback(() => {
    const filmDate = moment.utc(film_date);
    dispatch(actions.fetchWindow({
      id,
      start_date: filmDate.subtract(5, 'days').format(DATE_FORMAT),
      end_date: filmDate.add(10, 'days').format(DATE_FORMAT)
    }));
  }, [dispatch, film_date, id]);

  const createPrevNextLinks = useCallback(curIndex => {
    const prevCollection = curIndex < collections.length - 1 ? collections[curIndex + 1] : null;
    const prevLnk        = prevCollection ? canonicalLink(prevCollection) : null;
    setPrevLink(prevLnk);

    const nextCollection = curIndex > 0 ? collections[curIndex - 1] : null;
    const nextLnk        = nextCollection ? canonicalLink(nextCollection) : null;
    setNextLink(nextLnk);
  }, [collections]);

  // Fetch units files if needed.
  const cusForFetch = useMemo(() => cuIDs?.filter(id => cuId !== id).filter(id => {
    if (wipMap.units[id] || errorMap.units[id])
      return false;
    const cu = content_units.find(x => x.id === id);
    return !cu?.files;
  }) || [], [cuIDs, cuId, wipMap.units, errorMap.units, content_units]);

  useEffect(() => {
    if (cusForFetch?.length > 0) {
      dispatch(actions.fetchUnitsByIDs({ id: cusForFetch, with_files: true }));
    }
  }, [dispatch, cusForFetch]);

  useEffect(() => {
    //full fetch currently played unit
    if (cuId && !fullUnitFetchedMap[cuId] && !wipMap.units[cuId] && !errorMap.units[cuId]) {
      dispatch(actions.fetchUnit(cuId));
    }
  }, [dispatch, cuIDs, errorMap.units, wipMap.units, fullUnitFetchedMap, cuId]);

  useEffect(() => {
    if (!Object.prototype.hasOwnProperty.call(wipMap.collections, cId)) {
      // never fetched as full so fetch now
      dispatch(actions.fetchCollection(cId));
    }
  }, [cId, dispatch, wipMap.collections]);

  useEffect(() => {
    // next prev links only for lessons
    if (COLLECTION_DAILY_LESSONS.includes(content_type)) {
      // empty or no window
      if (!cWindow.data || cWindow.data.length === 0) {
        if (!wipMap.cWindow[cId]) {
          // no wip, go fetch
          fetchWindow(id, film_date);
        }
      } else {
        const { id: cWindowId, data } = cWindow;
        const curIndex                = data.indexOf(cId);
        if (cId !== cWindowId
          && (curIndex <= 0 || curIndex === collections?.length - 1)
          && !wipMap.cWindow[cId]) {
          // it's not our window,
          // we're not in it (at least not in the middle, we could reuse it otherwise)
          // and our window is not wip
          fetchWindow(id, film_date);
        } else {
          // it's a good window, extract the previous and next links
          createPrevNextLinks(curIndex);
        }
      }
    }
  }, [cId, cWindow, collections?.length, content_type, createPrevNextLinks, fetchWindow, film_date, id, wipMap.cWindow]);

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
      nextLink={nextLink}
      prevLink={prevLink}
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

export default React.memo(withNamespaces()(PlaylistCollectionContainer), areEqual);
