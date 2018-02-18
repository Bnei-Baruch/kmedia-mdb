import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { CT_CONGRESS, CT_HOLIDAY, CT_PICNIC, CT_UNITY_DAY } from '../../../../../helpers/consts';
import { selectors as settings } from '../../../../../redux/modules/settings';
import { selectors as filterSelectors } from '../../../../../redux/modules/filters';
import { selectors as mdb } from '../../../../../redux/modules/mdb';
import { actions, selectors } from '../../../../../redux/modules/events';
import * as shapes from '../../../../shapes';
import Page from './Page';

const TAB_NAME_CT_MAP = {
  conventions: CT_CONGRESS,
  holidays: CT_HOLIDAY,
  'unity-days': CT_UNITY_DAY,
};

class TabContainer extends Component {
  static propTypes = {
    tabName: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(shapes.EventCollection),
    fetchAllEvents: PropTypes.func.isRequired,
    wip: shapes.WIP,
    err: shapes.Error,
  };

  static defaultProps = {
    items: [],
    wip: false,
    err: null,
  };

  componentDidMount() {
    const { items, fetchAllEvents, wip, err } = this.props;

    // We only fetch one time on first mount, if not wip or error.
    // Next time we fetch is on language change.
    if (items.length === 0 && !(wip || err)) {
      fetchAllEvents();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { language } = nextProps;

    if (language !== this.props.language) {
      nextProps.fetchAllEvents();
    }
  }

  render() {
    const { tabName, items, wip, err } = this.props;
    return <Page tabName={tabName} items={items} wip={wip} err={err} />;
  }
}

const mapState = (state, ownProps) => {
  const { tabName } = ownProps;
  const filters     = filterSelectors.getFilters(state.filters, `events-${tabName}`);
  const ids         = selectors.getFilteredData(state.events, TAB_NAME_CT_MAP[tabName], filters, state.mdb);

  return {
    items: ids.map(x => mdb.getCollectionById(state.mdb, x)),
    language: settings.getLanguage(state.settings),
    wip: selectors.getWip(state.events).collections,
    err: selectors.getErrors(state.events).collections,
  };
};

const mapDispatch = dispatch => (
  bindActionCreators({
    fetchAllEvents: actions.fetchAllEvents,
  }, dispatch)
);

export default connect(mapState, mapDispatch)(TabContainer);
