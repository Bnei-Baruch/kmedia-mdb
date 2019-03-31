import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { CT_DAILY_LESSON, CT_SPECIAL_LESSON, DATE_FORMAT } from '../../../helpers/consts';
import { canonicalLink } from '../../../helpers/links';
import { actions, selectors } from '../../../redux/modules/mdb';
import { selectors as settings } from '../../../redux/modules/settings';
import * as shapes from '../../shapes';
import Page from './Page';

export class PlaylistCollectionContainer extends Component {
  static propTypes = {
    match: shapes.RouterMatch.isRequired,
    collection: shapes.GenericCollection,
    wip: shapes.WipMap.isRequired,
    errors: shapes.ErrorsMap.isRequired,
    language: PropTypes.string.isRequired,
    contentLanguage: PropTypes.string.isRequired,
    PlaylistComponent: PropTypes.func,
    fetchCollection: PropTypes.func.isRequired,
    fetchUnit: PropTypes.func.isRequired,
    shouldRenderHelmet: PropTypes.bool,
    fetchWindow: PropTypes.func.isRequired,
    cWindow: shapes.cWindow.isRequired,
    location: shapes.HistoryLocation.isRequired,
  };

  static defaultProps = {
    collection: null,
    PlaylistComponent: undefined,
    shouldRenderHelmet: true,
  };

  static askForDataIfNeeded = (props) => {
    const { match, collection, wip, errors, fetchCollection, fetchUnit } = props;

    // We fetch stuff if we don't have it already
    // and a request for it is not in progress or ended with an error.
    const { id } = match.params;

    let fetchedSingle = false;
    if (!Object.prototype.hasOwnProperty.call(wip.collections, id)) {
      // never fetched as full so fetch now
      fetchCollection(id);
      fetchedSingle = true;
    }

    if (collection && collection.id === id && Array.isArray(collection.cuIDs)) {
      collection.cuIDs.forEach((cuID) => {
        const cu = collection.content_units.find(x => x.id === cuID);
        if (!cu || !cu.files) {
          if (!(wip.units[cuID] || errors.units[cuID])) {
            fetchUnit(cuID);
          }
        }
      });
    } else if (!fetchedSingle && !(wip.collections[id] || errors.collections[id])) {
      fetchCollection(id);
    }

    // next prev links only for lessons
    if (collection
      && (collection.content_type === CT_DAILY_LESSON
        || collection.content_type === CT_SPECIAL_LESSON)) {
      return PlaylistCollectionContainer.getNextPrevLinks(props);
    }

    return null;
  };

  constructor(props) {
    super(props);

    this.state = {
      nextLink: null,
      prevLink: null,
    };
  }

  componentDidMount() {
    const links = PlaylistCollectionContainer.askForDataIfNeeded(this.props);
    this.setState(links);
  }

  static getDerivedStateFromProps(nextProps) {
    return PlaylistCollectionContainer.askForDataIfNeeded(nextProps);
  }

  static getNextPrevLinks = (props) => {
    const { match, wip, cWindow } = props;
    const { id }                  = match.params;
    let links                     = null;

    // empty or no window
    if (!cWindow.data || cWindow.data.length === 0) {
      if (!wip.cWindow[id]) {
        // no wip, go fetch
        PlaylistCollectionContainer.getWindow(props);
      }
      return null;
    }

    const { id: cWindowId, data: collections } = cWindow;

    const curIndex = collections.indexOf(id);
    if (id !== cWindowId
      && (curIndex <= 0 || curIndex === collections.length - 1)
      && !wip.cWindow[id]) {
      // it's not our window,
      // we're not in it (at least not in the middle, we could reuse it otherwise)
      // and our window is not wip
      PlaylistCollectionContainer.getWindow(props);
    } else {
      // it's a good window, extract the previous and next links
      const prevCollection = curIndex < collections.length - 1 ? collections[curIndex + 1] : null;
      const prevLink       = prevCollection ? canonicalLink({
        id: prevCollection, content_type: CT_DAILY_LESSON
      }) : null;

      const nextCollection = curIndex > 0 ? collections[curIndex - 1] : null;
      const nextLink       = nextCollection ? canonicalLink({
        id: nextCollection,
        content_type: CT_DAILY_LESSON
      }) : null;

      links = { nextLink, prevLink };
    }

    return links;
  };

  static getWindow = (props) => {
    const { collection, fetchWindow } = props;

    const filmDate = moment.utc(collection.film_date);
    fetchWindow({
      id: collection.id,
      start_date: filmDate.subtract(5, 'days').format(DATE_FORMAT),
      end_date: filmDate.add(10, 'days').format(DATE_FORMAT)
    });
  };

  render() {
    const { match, language, contentLanguage, collection, wip: wipMap, errors, PlaylistComponent, shouldRenderHelmet, location } = this.props;

    // We're wip / err if some request is wip / err
    const { id } = match.params;
    let wip      = wipMap.collections[id];
    let err      = errors.collections[id];
    if (collection) {
      wip = wip || (Array.isArray(collection.cuIDs) && collection.cuIDs.some(cuID => wipMap.units[cuID]));
      if (!err) {
        const cuIDwithError = Array.isArray(collection.cuIDs) && collection.cuIDs.find(cuID => errors.units[cuID]);
        err                 = cuIDwithError ? errors.units[cuIDwithError] : null;
      }
    }

    const { nextLink, prevLink } = this.state;

    return (
      <Page
        collection={collection}
        wip={wip}
        err={err}
        uiLanguage={language}
        contentLanguage={contentLanguage}
        PlaylistComponent={PlaylistComponent}
        shouldRenderHelmet={shouldRenderHelmet}
        location={location}
        nextLink={nextLink}
        prevLink={prevLink}
      />
    );
  }
}

function mapState(state, props) {
  const collection = selectors.getDenormCollectionWUnits(state.mdb, props.match.params.id);
  return {
    collection,
    language: settings.getLanguage(state.settings),
    contentLanguage: settings.getContentLanguage(state.settings),
    wip: selectors.getWip(state.mdb),
    errors: selectors.getErrors(state.mdb),
    items: selectors.getCollections(state.mdb),
    cWindow: selectors.getWindow(state.mdb),
  };
}

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchCollection: actions.fetchCollection,
    fetchUnit: actions.fetchUnit,
    fetchWindow: actions.fetchWindow,
  }, dispatch);
}

export default withRouter(connect(mapState, mapDispatch)(PlaylistCollectionContainer));
