import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import PropTypes from 'prop-types';
import moment from 'moment';

import { actions, selectors } from '../../../redux/modules/mdb';
import { actions as recommended } from '../../../redux/modules/recommended';
import { COLLECTION_DAILY_LESSONS, DATE_FORMAT } from '../../../helpers/consts';
import { canonicalLink } from '../../../helpers/links';
import WipErr from '../../shared/WipErr/WipErr';
import Page from './Page';

const PlaylistCollectionContainer = ({ cId, t, cuId }) => {
  const collection         = useSelector(state => selectors.getDenormCollectionWUnits(state.mdb, cId));
  const wipMap             = useSelector(state => selectors.getWip(state.mdb));
  const fullUnitFetchedMap = useSelector(state => selectors.getFullUnitFetched(state.mdb));
  const errorMap           = useSelector(state => selectors.getErrors(state.mdb));
  const cWindow            = useSelector(state => selectors.getWindow(state.mdb));
  const collections        = useSelector(state => cWindow?.data?.map(id => selectors.getDenormCollection(state.mdb, id)).filter(c => !!c));

  const [nextLink, setNextLink] = useState(null);
  const [prevLink, setPrevLink] = useState(null);

  const dispatch = useDispatch();

  const createPrevNextLinks = curIndex => {
    const prevCollection = curIndex < collections.length - 1 ? collections[curIndex + 1] : null;
    const prevLnk        = prevCollection ? canonicalLink(prevCollection) : null;
    setPrevLink(prevLnk);

    const nextCollection = curIndex > 0 ? collections[curIndex - 1] : null;
    const nextLnk        = nextCollection ? canonicalLink(nextCollection) : null;
    setNextLink(nextLnk);
  };

  useEffect(() => {
    if (!Object.prototype.hasOwnProperty.call(wipMap.collections, cId)) {
      // never fetched as full so fetch now
      dispatch(actions.fetchCollection(cId));
    }

    if (collection) {
      const { id, cuIDs, content_units, content_type, film_date } = collection;

      // Fetch full units data if needed.
      if (Array.isArray(cuIDs) && cuIDs.length > 0) {
        cuIDs.forEach(cuID => {
          if (!fullUnitFetchedMap[cuID] && !wipMap.units[cuID] && !errorMap.units[cuID]) {
            const cu = content_units.find(x => x.id === cuID);
            if (!cu || !cu.files || !cu.tags || !cu.sources) {
              dispatch(actions.fetchUnit(cuID));
            }
          }
        });
      }

      // next prev links only for lessons
      if (COLLECTION_DAILY_LESSONS.includes(content_type)) {
        const fetchWindow = () => {
          const filmDate = moment.utc(film_date);
          dispatch(actions.fetchWindow({
            id,
            start_date: filmDate.subtract(5, 'days').format(DATE_FORMAT),
            end_date: filmDate.add(10, 'days').format(DATE_FORMAT)
          }));
        };

        // empty or no window
        if (!cWindow.data || cWindow.data.length === 0) {
          if (!wipMap.cWindow[cId]) {
            // no wip, go fetch
            fetchWindow(id, film_date);
          }
        } else {
          const { id: cWindowId, data } = cWindow;
          const curIndex                = data.indexOf(cId);
          // console.log('cWindow:', cWindowId, curIndex, collections);

          if (cId !== cWindowId
            && (curIndex <= 0 || curIndex === collections.length - 1)
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
    }
  }, [cId, cWindow, collection, errorMap.units, wipMap]);

  useEffect(() => {
    if (collection?.cuIDs)
      dispatch(recommended.fetchViews(collection.cuIDs));
  }, [collection?.cuIDs?.length]);

  if (!cId || !collection || !Array.isArray(collection.content_units)) {
    return null;
  }

  // We're wip / err if some request is wip / err
  const wip = wipMap.collections[cId] || (Array.isArray(collection.cuIDs) && collection.cuIDs.some(cuID => wipMap.units[cuID]));
  let err   = errorMap.collections[cId];
  if (!err) {
    const cuIDwithError = Array.isArray(collection.cuIDs) && collection.cuIDs.find(cuID => errorMap.units[cuID]);
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
  (prevProps.cId === nextProps.cId) && (prevProps.cuId === nextProps.cuId);

export default React.memo(withNamespaces()(PlaylistCollectionContainer), areEqual);
