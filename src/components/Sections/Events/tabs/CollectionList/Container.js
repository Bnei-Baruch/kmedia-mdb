import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import isEqual from 'react-fast-compare';

import { CT_CONGRESS, CT_HOLIDAY, CT_UNITY_DAY } from '../../../../../helpers/consts';
import { selectors as settings } from '../../../../../redux/modules/settings';
import { selectors as filterSelectors } from '../../../../../redux/modules/filters';
import { selectors as mdb } from '../../../../../redux/modules/mdb';
import { actions, selectors } from '../../../../../redux/modules/events';
import Page from './Page';

const TAB_NAME_CT_MAP = {
  conventions: CT_CONGRESS,
  holidays: CT_HOLIDAY,
  'unity-days': CT_UNITY_DAY,
};

const CollectionListContainer = ({ tabName }) => {
  const filters = useSelector(state => filterSelectors.getFilters(state.filters, `events-${tabName}`), isEqual);
  const ids = useSelector(state => selectors.getFilteredData(state.events, TAB_NAME_CT_MAP[tabName], filters, state.mdb), isEqual);
  const items = useSelector(state => ids.map(x => mdb.getCollectionById(state.mdb, x)), isEqual);
  const language = useSelector(state => settings.getLanguage(state.settings));
  const wip = useSelector(state => selectors.getWip(state.events));
  const err = useSelector(state => selectors.getError(state.events));

  const [dataLoaded, setDataLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setDataLoaded(false);
  }, [language])

  useEffect(() => {
    if (!dataLoaded && !wip && !err) {
      dispatch(actions.fetchAllEvents());
      setDataLoaded(true);
    }

  }, [dispatch, dataLoaded, wip, err]);

  return <Page tabName={tabName} items={items} wip={wip} err={err} />;
};

CollectionListContainer.propTypes = {
  tabName: PropTypes.string.isRequired,
};

const areEqual = (prevProps, nextProps) => prevProps.tabName === nextProps.tabName;

export default React.memo(CollectionListContainer, areEqual);
