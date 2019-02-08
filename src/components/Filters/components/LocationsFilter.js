import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
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

const cmpFn = (a, b) => strCmp(a.text, b.text);

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
    const { congressEvents } = this.props;
    if (congressEvents !== nextProps.congressEvents) {
      this.setState({ tree: this.getTree(nextProps) });
    }
  }

  getTree = (props) => {
    const { congressEvents, t } = props;

    let byCountry = groupBy(congressEvents, x => x.country || 'Unknown');

    byCountry = mapValues(byCountry, (v) => {
      const byCity = Object.entries(countBy(v, x => x.city || 'Unknown'));
      return {
        byCity,
        count: v.length,
      };
    });

    byCountry = Object.entries(byCountry);

    const children = byCountry
      .map(([country, { count, byCity }]) => {
        const res = {
          ...this.buildNode(country, count, t),
          children: byCity.map(([city, cityCount]) => this.buildNode(city, cityCount, t))
        };
        if (byCity.length > 1) {
          res.children.sort(cmpFn);
        }
        return res;
      });

    children.sort(cmpFn);

    return [
      {
        value: 'root',
        text: t('filters.locations-filter.all'),
        count: congressEvents.length,
        children
      }
    ];
  };

  buildNode = (id, count, t) => ({
    value: id,
    text: t(`locations.${id.trim().toLowerCase().replace(/[\s_.]+/g, '-')}`, { defaultValue: id }),
    count,
  });

  render() {
    const { tree } = this.state;
    return <HierarchicalFilter name="locations-filter" tree={tree} {...this.props} />;
  }
}

export default connect(
  (state) => {
    const cIDs = selectors.getEventsByType(state.events)[CT_CONGRESS];
    return {
      congressEvents: (cIDs || []).map(x => mdb.getDenormCollection(state.mdb, x)),
    };
  },
)(withNamespaces()(LocationsFilter));
