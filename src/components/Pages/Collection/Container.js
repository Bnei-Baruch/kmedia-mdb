import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { actions, selectors as mdb } from '../../../redux/modules/mdb';
import { selectors as settings } from '../../../redux/modules/settings';
import * as shapes from '../../shapes';
import Page from './Page';

class CollectionContainer extends Component {

  static propTypes = {
    namespace: PropTypes.string.isRequired,
    location: shapes.HistoryLocation.isRequired,
    match: shapes.RouterMatch.isRequired,
    collection: shapes.GenericCollection,
    wip: PropTypes.bool,
    err: shapes.Error,
    language: PropTypes.string.isRequired,
    fetchCollection: PropTypes.func.isRequired,
    renderUnit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    collection: null,
    wip: false,
    err: null,
  };

  componentDidMount() {
    if (!this.props.collection) {
      this.fetchCollection(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id !== this.props.match.params.id ||
      nextProps.language !== this.props.language) {
      this.fetchCollection(nextProps);
    }
  }

  fetchCollection = (props) => {
    props.fetchCollection(props.match.params.id);
  };

  render() {
    const { collection, wip, err, namespace, renderUnit } = this.props;

    return (
      <Page
        namespace={namespace}
        collection={collection}
        wip={wip}
        err={err}
        renderUnit={renderUnit}
      />
    );
  }
}

function mapState(state, ownProps) {
  const id         = ownProps.match.params.id;
  const collection = mdb.getDenormCollection(state.mdb, id);
  const wipMap     = mdb.getWip(state.mdb);
  const errMap     = mdb.getErrors(state.mdb);

  return {
    namespace: ownProps.namespace,
    collection,
    wip: wipMap.collections[id],
    err: errMap.collections[id],
    language: settings.getLanguage(state.settings),
  };
}

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchCollection: actions.fetchCollection,
  }, dispatch);
}

export default withRouter(connect(mapState, mapDispatch)(CollectionContainer));
