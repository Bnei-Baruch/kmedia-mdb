import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { actions, selectors } from '../../../redux/modules/mdb';
import { selectors as settings } from '../../../redux/modules/settings';
import { canonicalLink } from '../../../helpers/links';
import * as shapes from '../../shapes';
import Page from './Page';

export class PlaylistCollectionContainer extends Component {
  static propTypes = {
    match: shapes.RouterMatch.isRequired,
    collection: shapes.GenericCollection,
    wip: shapes.WipMap.isRequired,
    errors: shapes.ErrorsMap.isRequired,
    language: PropTypes.string.isRequired,
    PlaylistComponent: PropTypes.func,
    fetchCollection: PropTypes.func.isRequired,
    fetchUnit: PropTypes.func.isRequired,
    shouldRenderHelmet: PropTypes.bool,
    fetchWindow: PropTypes.func.isRequired,
    cWindow: PropTypes.any,
  };

  static defaultProps = {
    collection: null,
    PlaylistComponent: undefined,
    shouldRenderHelmet: true,
  };

  state = {
    nextLink: null,
    prevLink: null,
  };

  componentDidMount() {
    this.askForDataIfNeeded(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.askForDataIfNeeded(nextProps);
  }

  askForDataIfNeeded = (props) => {
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
  
    if (collection) {
      this.getNextPrevLinks(props);
    }
  
  };
  
  getNextPrevLinks = (props) => {
    const { match, wip, cWindow } = props;
    const { id } = match.params;

    if (!cWindow || cWindow.length === 0) {      
      if (!wip.cWindow) {
        this.getWindow(props);   
      }
      return;
    }

    let result = cWindow[0];
    let cWindowId = result.id;
    let collections = result.data.collections;      
    let curIndex = collections.findIndex(x => {
      return x.id === id;
    });
    if (id !== cWindowId && (curIndex === 0 || curIndex === collections.length-1) && !wip.cWindow[id]) {
      this.getWindow(props);
    }
    else {
      let prevCollection = curIndex < collections.length-1 ? collections[curIndex + 1] : null;
      let prevLink = prevCollection ? canonicalLink(prevCollection) : null;
      let nextCollection = curIndex > 0 ? collections[curIndex - 1] : null;
      let nextLink = nextCollection ? canonicalLink(nextCollection) : null;
      this.setState({nextLink, prevLink})
    }           
  }

  getWindow = (props) => {
    const { match, collection, fetchWindow } = props;
    const { id } = match.params;    
    if (!fetchWindow) {
      return;
    }
    let fromDate = new Date(collection.film_date);
    fromDate.setDate(fromDate.getDate() - 5);
    let toDate = new Date(collection.film_date);
    toDate.setDate(toDate.getDate() + 5);
    fetchWindow({id:id ,start_date:this.formatDate(fromDate), end_date:this.formatDate(toDate)});       
  }

  formatDate = (date) => {
    let d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();
    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [year, month, day].join('-');
  }

  render() {
    const { match, language, collection, wip: wipMap, errors, PlaylistComponent, shouldRenderHelmet } = this.props;

    // We're wip / err if some request is wip / err
    const { id } = match.params;
    let wip  = wipMap.collections[id];
    let err  = errors.collections[id];
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
        language={language}
        PlaylistComponent={PlaylistComponent}
        shouldRenderHelmet={shouldRenderHelmet}
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
    wip: selectors.getWip(state.mdb),
    errors: selectors.getErrors(state.mdb),
    language: settings.getLanguage(state.settings),
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

