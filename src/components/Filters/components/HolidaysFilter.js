import React, { Component } from 'react';
import PropTypes from 'prop-types';
import countBy from 'lodash/countBy';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import { CT_HOLIDAY } from '../../../helpers/consts';
import { selectors } from '../../../redux/modules/events';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { selectors as tags } from '../../../redux/modules/tags';
import * as shapes from '../../shapes';
import HierarchicalFilter from './HierarchicalFilter';

class HolidaysFilter extends Component {
  static propTypes = {
    holidayEvents: PropTypes.arrayOf(shapes.EventCollection).isRequired,
    getTagById: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { tree: this.getTree(this.props) };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.holidayEvents !== nextProps.holidayEvents &&
      this.props.getTagById !== nextProps.getTagById) {
      this.setState({ tree: this.getTree(nextProps) });
    }
  }

  getTree = (props) => {
    const { holidayEvents, getTagById, t } = props;

    const counts = countBy(holidayEvents, x => x.holiday_id);
    return [
      {
        value: 'root',
        text: t('filters.holidays-filter.all'),
        count: holidayEvents.length,
        children: Object.entries(counts).map(([tagID, count]) => this.buildNode(tagID, count, getTagById))
      }
    ];
  };

  buildNode = (id, count, getTagById) => {
    const { label } = getTagById(id);
    return {
      value: id,
      text: label,
      count,
    };
  };

  render() {
    const { tree } = this.state;
    return <HierarchicalFilter name="holidays-filter" tree={tree} {...this.props} />;
  }
}

export default connect(
  (state) => {
    const cIDs = selectors.getEventsByType(state.events)[CT_HOLIDAY];
    return {
      holidayEvents: (cIDs || []).map(x => mdb.getCollectionById(state.mdb, x)),
      getTagById: tags.getTagById(state.tags),
    };
  },
)(withNamespaces()(HolidaysFilter));
