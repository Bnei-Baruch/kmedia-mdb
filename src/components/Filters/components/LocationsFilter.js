import React, { Component } from 'react';
import PropTypes from 'prop-types';
import countBy from 'lodash/countBy';
import groupBy from 'lodash/groupBy';
import mapValues from 'lodash/mapValues';
import { connect } from 'react-redux';

import { CT_CONGRESS } from '../../../helpers/consts';
import { strCmp } from '../../../helpers/utils';
import { selectors } from '../../../redux/modules/events';
import { selectors as mdb } from '../../../redux/modules/mdb';
import * as shapes from '../../shapes';
import HierarchicalFilter from './HierarchicalFilter';

const cmpFn = (a, b) => {
  const x = a[0];
  const y = b[0];

  if (x === 'Unknown') {
    return 1;
  }

  if (y === 'Unknown') {
    return -1;
  }

  return strCmp(x, y);
};

class LocationsFilter extends Component {
  static propTypes = {
    congressEvents: PropTypes.arrayOf(shapes.EventCollection).isRequired,
    t: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { tree: this.getTree(this.props) };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.congressEvents !== nextProps.congressEvents) {
      this.setState({ tree: this.getTree(nextProps) });
    }
  }

  getTree = (props) => {
    const { congressEvents, t } = props;

    let byCountry = groupBy(congressEvents, x => x.country || 'Unknown');

    byCountry     = mapValues(byCountry, (v) => {
      const byCity = Object.entries(countBy(v, x => x.city || 'Unknown'));
      byCity.sort(cmpFn);
      return {
        byCity,
        count: v.length,
      };
    });

    byCountry = Object.entries(byCountry);
    byCountry.sort(cmpFn);

    return [
      {
        value: 'root',
        text: t('filters.locations-filter.all'),
        count: congressEvents.length,
        children: byCountry
          .map(([country, { count, byCity }]) => ({
            ...this.buildNode(country, count),
            children: byCity.map(([city, cityCount]) => this.buildNode(city, cityCount))
          }))
      }
    ];
  };

  buildNode = (id, count) => ({
    value: id,
    text: id,
    count,
  });

  render() {
    const { tree } = this.state;
    return <HierarchicalFilter tree={tree} {...this.props} />;
  }
}

export default connect(
  (state) => {
    const cIDs = selectors.getEventsByType(state.events)[CT_CONGRESS];
    return {
      congressEvents: (cIDs || []).map(x => mdb.getDenormCollection(state.mdb, x)),
    };
  },
)(LocationsFilter);
