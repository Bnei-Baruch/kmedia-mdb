import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import 'moment-duration-format';

import { EVENT_TYPES } from '../../../../helpers/consts';
import { selectors as mdb } from '../../../../redux/modules/mdb';
import { actions, selectors } from '../../../../redux/modules/events';
import * as shapes from '../../../shapes';
import RelevantParts from './RelevantParts';

const getRelevantCollectionId = (unit) => {
  if (unit.collections) {
    const collections        = Object.values(unit.collections);
    const relevantCollection = collections.find(collection =>
      EVENT_TYPES.indexOf(collection.content_type) !== -1
    );

    if (relevantCollection) {
      return relevantCollection.id;
    }
  }

  return null;
};

class RelevantPartsContainer extends Component {

  static propTypes = {
    unit: shapes.EventItem.isRequired,
    collectionID: PropTypes.string,
    collection: shapes.GenericCollection,
    wip: shapes.WIP,
    err: shapes.Error,
    fetchCollection: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    collection: null,
    collectionID: '',
    wip: false,
    err: null
  };

  state = {
    fullCollectionRequested: false,
  };

  componentDidMount() {
    this.askForDataIfNeeded(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.askForDataIfNeeded(nextProps);
  }

  askForDataIfNeeded = (props) => {
    const { collectionID, wip, err, fetchCollection } = props;

    // TODO:
    // Maybe in the future we'll do something more sophisticated
    // to fetch data only in the case we really need it
    // The following code is wrong.
    //
    // We fetch stuff if we don't have it already
    // and a request for it is not in progress or ended with an error.
    // if (
    //   collection &&
    //   collection.id === collectionID &&
    //   Array.isArray(collection.content_units)) {
    //   return;
    // }

    if (this.state.fullCollectionRequested) {
      return;
    }

    if (collectionID && !(wip || err)) {
      fetchCollection(collectionID);
      this.setState({ fullCollectionRequested: true });
    }
  };

  render() {
    const { unit, collection, wip, err, t } = this.props;

    return (
      <RelevantParts
        unit={unit}
        wip={wip}
        err={err}
        collection={wip || err ? null : collection}
        t={t}
      />
    );
  }
}

export default connect(
  (state, ownProps) => {
    const collectionID = getRelevantCollectionId(ownProps.unit);
    return {
      collectionID,
      collection: collectionID ? mdb.getDenormCollection(state.mdb, collectionID) : null,
      wip: selectors.getWip(state.events).fulls[collectionID],
      errors: selectors.getErrors(state.events).fulls[collectionID],
    };
  },
  dispatch => bindActionCreators({
    fetchCollection: actions.fetchFullEvent,
  }, dispatch)
)(RelevantPartsContainer);
