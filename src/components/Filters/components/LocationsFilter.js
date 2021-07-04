import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import countBy from 'lodash/countBy';
import groupBy from 'lodash/groupBy';
import mapValues from 'lodash/mapValues';
import { useSelector } from 'react-redux';

import { CT_CONGRESS } from '../../../helpers/consts';
import { strCmp } from '../../../helpers/utils';
import { selectors } from '../../../redux/modules/events';
import { selectors as mdb } from '../../../redux/modules/mdb';
import HierarchicalFilter from './HierarchicalFilter';

const cmpFn = (a, b) => strCmp(a.text, b.text);

const getTree = (congressEvents, t) => {
  let byCountry = groupBy(congressEvents, x => x.country || 'Unknown');

  byCountry = mapValues(byCountry, v => {
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
        ...buildNode(country, count, t),
        children: byCity.map(([city, cityCount]) => buildNode(city, cityCount, t))
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

const buildNode = (id, count, t) => ({
  value: id,
  text: t(`locations.${id.trim().toLowerCase().replace(/[\s_.]+/g, '-')}`, { defaultValue: id }),
  count,
});

const LocationsFilter = props => {
  const cIDs           = useSelector(state => selectors.getEventsByType(state.events)[CT_CONGRESS]);
  const congressEvents = useSelector(state => (cIDs || []).map(x => mdb.getDenormCollection(state.mdb, x)).fiter(c => !!c));

  const { t } = props;
  const tree  = useMemo(() => getTree(congressEvents, t), [congressEvents, t]);

  return <HierarchicalFilter name="locations-filter" tree={tree} {...props} t={t} />;
};

LocationsFilter.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(LocationsFilter);
