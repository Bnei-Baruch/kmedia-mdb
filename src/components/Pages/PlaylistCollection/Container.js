import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';

import { COLLECTION_DAILY_LESSONS, DATE_FORMAT } from '../../../helpers/consts';
import { canonicalLink } from '../../../helpers/links';
import playerHelper from '../../../helpers/player';
import { isEmpty } from '../../../helpers/utils';

import { actions, selectors } from '../../../redux/modules/mdb';
import { selectors as settings } from '../../../redux/modules/settings';
import WipErr from '../../shared/WipErr/WipErr';
import Page from './Page';

const PlaylistCollectionContainer = ({ cId, t, cuId }) => {
  const collection   = useSelector(state => selectors.getDenormCollectionWUnits(state.mdb, cId), shallowEqual);
  const wipMap       = useSelector(state => selectors.getWip(state.mdb), shallowEqual);
  const errorMap     = useSelector(state => selectors.getErrors(state.mdb), shallowEqual);
  const cWindow      = useSelector(state => selectors.getWindow(state.mdb), shallowEqual);
  const collections  = useSelector(state => cWindow?.data?.map(id => selectors.getDenormCollection(state.mdb, id)).filter(c => !!c), shallowEqual);
  const uiLanguage   = useSelector(state => settings.getLanguage(state.settings));
  const location     = useLocation();
  const history      = useHistory();

  const [nextLink, setNextLink] = useState(null);
  const [prevLink, setPrevLink] = useState(null);

  const { cuIDs, content_units, content_type, film_date } = collection || false;

  // select a unit if not given from the link
  cuId = cuId || cuIDs?.[playerHelper.getActivePartFromQuery(location)];

  useEffect(() => {
    const unit = content_units?.find(u => u.id === cuId);
    if (unit) {
      // if a unit not given in the link - replace it here to avoid refresh of the page after user selects
      const shareUrl = canonicalLink(unit, null, collection);

      if (!location.pathname.includes(shareUrl)) {
        history.replace(`/${uiLanguage}${shareUrl}`)
      }
    }
  }, [collection, content_units, cuId, history, location, uiLanguage])

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

  const fetchWindow = useCallback(() => {
    const filmDate = moment.utc(film_date);
    dispatch(actions.fetchWindow({
      cId,
      start_date: filmDate.subtract(5, 'days').format(DATE_FORMAT),
      end_date: filmDate.add(10, 'days').format(DATE_FORMAT)
    }));
  }, [cId, film_date, dispatch]);

  const createPrevNextLinks = useCallback(curIndex => {
    const prevCollection = curIndex < collections.length - 1 ? collections[curIndex + 1] : null;
    const prevLnk        = prevCollection ? canonicalLink(prevCollection) : null;
    setPrevLink(prevLnk);

    const nextCollection = curIndex > 0 ? collections[curIndex - 1] : null;
    const nextLnk        = nextCollection ? canonicalLink(nextCollection) : null;
    setNextLink(nextLnk);
  }, [collections]);

  useEffect(() => {
    // next prev links only for lessons
    if (COLLECTION_DAILY_LESSONS.includes(content_type)) {
      const { id: cWindowId, data } = cWindow || {};
      // empty or no window
      if (!data || data.length === 0) {
        if (!wipMap.cWindow[cId]) {
          // no wip, go fetch
          fetchWindow(cId, film_date);
        }
      } else {
        const curIndex = data.indexOf(cId);

        if (cId !== cWindowId
          && (curIndex <= 0 || curIndex === collections?.length - 1)
          && !wipMap.cWindow[cId]) {
          // it's not our window,
          // we're not in it (at least not in the middle, we could reuse it otherwise)
          // and our window is not wip
          fetchWindow(cId, film_date);
        } else {
          // it's a good window, extract the previous and next links
          createPrevNextLinks(curIndex);
        }
      }
    }
  }, [cId, cWindow, collections?.length, content_type, createPrevNextLinks, fetchWindow, film_date, wipMap.cWindow]);


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
