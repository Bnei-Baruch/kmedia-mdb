import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { canonicalCollection } from '../../../../../../helpers/utils';
import { actions, selectors } from '../../../../../../redux/modules/mdb';
import * as shapes from '../../../../../shapes';
import Widget from './Widget';

export class SameCollectionContainer extends Component {
  static propTypes = {
    unit: shapes.EventItem.isRequired,
    collectionID: PropTypes.string,
    collection: shapes.GenericCollection,
    wip: shapes.WIP,
    err: shapes.Error,
    section: PropTypes.string,
    fetchCollection: PropTypes.func.isRequired,
  };

  static defaultProps = {
    collection: null,
    collectionID: '',
    wip: false,
    err: null,
    section: '',
  };

  state = {
    collectionRequested: false,
  };

  componentDidMount() {
    this.askForDataIfNeeded(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.askForDataIfNeeded(nextProps);
  }

  askForDataIfNeeded = (props) => {
    const { collectionID, wip, err, fetchCollection } = props;
    const { collectionRequested }                     = this.state;
    if (collectionRequested) {
      return;
    }

    if (collectionID && !(wip || err)) {
      fetchCollection(collectionID);
      this.setState({ collectionRequested: true });
    }
  };

  render() {
    const { unit, collection, wip, err, section } = this.props;

    return (
      <Widget
        unit={unit}
        wip={wip}
        err={err}
        collection={wip || err ? null : collection}
        section={section}
      />
    );
  }
}

const mapState = (state, ownProps) => {
  const c            = canonicalCollection(ownProps.unit);
  const collectionID = c ? c.id : null;
  return {
    collectionID,
    collection: collectionID ? selectors.getDenormCollection(state.mdb, collectionID) : null,
    wip: selectors.getWip(state.mdb).collections[collectionID],
    errors: selectors.getErrors(state.mdb).collections[collectionID],
  };
};

const mapDispatch = dispatch => bindActionCreators({
  fetchCollection: actions.fetchCollection,
}, dispatch);

export const wrap = WrappedComponent => connect(mapState, mapDispatch)(WrappedComponent);

export default wrap(SameCollectionContainer);
