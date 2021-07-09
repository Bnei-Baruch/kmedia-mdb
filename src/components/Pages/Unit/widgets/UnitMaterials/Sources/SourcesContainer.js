import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Segment } from 'semantic-ui-react';

import { tracePath, isEmpty } from '../../../../../../helpers/utils';
import { selectors } from '../../../../../../redux/modules/sources';
import { actions as assetsActions, selectors as assetsSelectors } from '../../../../../../redux/modules/assets';
import * as shapes from '../../../../../shapes';
import Sources, { getLikutimUnits } from './Sources';


const SourcesContainer = ({ unit, t }) => {
  const dispatch        = useDispatch();
  const sourceIndex     = useCallback(k => dispatch(assetsActions.sourceIndex(k)), [dispatch]);

  const getSourceById   = useSelector(state => selectors.getSourceById(state.sources));
  const indexById       = useSelector(state => assetsSelectors.getSourceIndexById(state.assets));

  const reducer         = useCallback((acc, val) => {
    acc[val] = indexById[val];
    return acc;
  }, [indexById]);
  const indexMap        = useCallback(sources => (sources || []).reduce(reducer, {}), [reducer]);

  const sourceOptions = useMemo(() =>
    (unit.sources || [])
      .map(getSourceById)
      .filter(x => !!x)
      .map(x => ({
        value: x.id,
        text: tracePath(x, getSourceById).map(y => y.name).join(' > '),
        disabled: indexMap[x.id] && !indexMap[x.id].data && !indexMap[x.id].wip,
      })),
  [getSourceById, indexMap, unit.sources]);

  const derivedOptions = useMemo(() => getLikutimUnits(unit)
    .map(x => ({
      value: x.id,
      text: t(`constants.content-types.${x.content_type}`),
      type: x.content_type,
      disabled: false,
    })) || [], [t, unit]);

  const options = [...sourceOptions, ...derivedOptions];

  useEffect(() => {
    Object.entries(indexMap(unit.sources)).forEach(([k, v]) => {
      if (isEmpty(v)) {
        sourceIndex(k);
      }
    });
  }, [unit.sources, indexMap, sourceIndex]);

  return options.length === 0
    ? <Segment basic>{t('materials.sources.no-sources')}</Segment>
    : <Sources
      unit={unit}
      indexMap={indexMap(unit.sources)}
      options={options}
    />;
};

SourcesContainer.propTypes = {
  unit: shapes.ContentUnit.isRequired,
  t: PropTypes.func.isRequired
};

export default withNamespaces()(SourcesContainer);
