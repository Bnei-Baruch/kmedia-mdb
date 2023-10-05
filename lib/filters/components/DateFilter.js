import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withTranslation, useTranslation } from 'next-i18next';
import { noop } from '../../../src/helpers/utils';
import { Accordion, Checkbox, Icon, List, Segment } from 'semantic-ui-react';
import moment from 'moment';
import 'react-day-picker/lib/style.css';

import {
  CUSTOM_DAY,
  CUSTOM_RANGE,
  datePresets,
  isValidDateRange,
  presetToRange,
  rangeToPreset,
  TODAY
} from '../../../src/components/Filters/components/Date/helper';
import { FN_DATE_FILTER } from '../../../src/helpers/consts';
import FastDayPicker from '../../../src/components/Filters/components/Date/FastDayPicker';
import { useDispatch, useSelector } from 'react-redux';
import { selectors as settings } from '../../redux/slices/settingsSlice/settingsSlice';
import { selectors as filtersAside } from '../../redux/slices/filterSlice/filterStatsSlice';
import { filterSlice, selectors as filters } from '../../redux/slices/filterSlice/filterSlice';
import FilterHeader from './FilterHeader';
import { isLanguageRtl } from '../../../src/helpers/i18n-utils';
import { definitionsByName } from '../transformer';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { updateFiltersSearchParams } from '../helper';
import { isEmpty } from 'lodash';
import { replace } from '@lagunovsky/redux-react-router';

const ENABLED_STATS_NAMESPACE = ['search'];

const stateFromParams = (params) => {
  if (isEmpty(params)) return false;
  const r = definition.queryToValue(params[0]) ?? false;
  const p = rangeToPreset(r.from, r.to);
  return {
    from: r.from,
    to: r.to,
    preset: (r ? p : null),
    showRange: (p === CUSTOM_RANGE),
    showDay: (p === CUSTOM_DAY)
  };
};

const definition = definitionsByName[FN_DATE_FILTER];
const DateFilter = ({ namespace }) => {
  const filterName = FN_DATE_FILTER;

  const { t } = useTranslation();

  const uiLang = useSelector(state => settings.getUILang(state.settings));
  const stats  = useSelector(state => filtersAside.getMultipleStats(state.filterStats, namespace, filterName)(datePresets));

  const searchParams = useSearchParams();
  const router       = useRouter();
  const selected     = searchParams.getAll(definition.queryKey);

  const { to, from, preset, showRange: _showRange, showDay: _showDay } = stateFromParams(selected);
  console.log('DateFilter searchParams', searchParams.toString(), to, from, preset, _showRange, _showDay);

  const [showRange, setShowRange] = useState(_showRange);
  const [showDay, setShowDay]     = useState(_showDay);

  const updateFilter = (_preset, _from, _to) => {
    const r     = buildRange(_preset, _from, _to);
    const query = updateFiltersSearchParams(definition.valueToQuery(r), !!r, filterName, searchParams, true);
    router.push({ query }, undefined, { scroll: false });
  };

  const buildRange = (_preset, _from = from, _to = to) => {
    if (!_preset) return null;
    // calculate range with regard to the date preset
    if (_preset === CUSTOM_RANGE || _preset === CUSTOM_DAY) {
      return { from: moment(_from).toDate(), to: moment(_to).toDate() };
    }

    return (presetToRange[_preset] || presetToRange[TODAY])();

  };

  const handleDatePresetsChange = (event, { value, checked }) => {
    if (!checked) value = null;
    updateFilter(value);
  };

  const handleDayInputChange = value => {
    if (!value) {
      return;
    }

    updateFilter(CUSTOM_DAY, value, value);
  };

  const handleFromInputChange = value => {
    if (!value) {
      return;
    }

    updateFilter(CUSTOM_RANGE, value, to);
  };

  const handleToInputChange = value => {
    if (!value) {
      return;
    }

    updateFilter(CUSTOM_RANGE, from, value);
  };

  const toggleRange = () => {
    setShowRange(!showRange);
    setShowDay(false);
  };

  const toggleDay = () => {
    setShowRange(false);
    setShowDay(!showDay);
  };

  const iconName      = `caret ${isLanguageRtl(uiLang) ? 'left' : 'right'}`;
  const renderContent = () => (
    <Segment.Group className="filter-popup__wrapper">
      {
        datePresets.map((x, i) => (
            <List.Item key={`${filterName}_${i}`}>
              <List.Content className="date-filter-presets">
                <Checkbox
                  label={t(`filters.date-filter.presets.${x}`)}
                  checked={preset === x}
                  value={x}
                  onChange={handleDatePresetsChange}
                />
                {ENABLED_STATS_NAMESPACE.includes(namespace) && <span className="stat">{`(${stats[i]})`}</span>}
              </List.Content>
            </List.Item>
          )
        )
      }
      <Accordion as={List} vertical="true" className="date-filter">
        <List.Item>
          <Accordion.Title
            active={showDay}
            onClick={toggleDay}
          >
            {t('filters.date-filter.presets.CUSTOM_DAY')}
            <Icon color="blue" name={iconName} />
          </Accordion.Title>
          <Accordion.Content active={showDay}>
            <FastDayPicker
              label={null}
              value={from}
              language={uiLang}
              onDayChange={handleDayInputChange}
            />
          </Accordion.Content>
        </List.Item>
        <List.Item>
          <Accordion.Title
            active={showRange}
            onClick={toggleRange}
          >
            {t('filters.date-filter.presets.CUSTOM_RANGE')}
            <Icon color="blue" name={iconName} />
          </Accordion.Title>
          <Accordion.Content active={showRange}>
            <FastDayPicker
              label={t('filters.date-filter.start')}
              value={from}
              language={uiLang}
              onDayChange={handleFromInputChange}
            />
            <br />
            <FastDayPicker
              label={t('filters.date-filter.end')}
              value={to}
              language={uiLang}
              onDayChange={handleToInputChange}
            />
          </Accordion.Content>
        </List.Item>
      </Accordion>
    </Segment.Group>
  );
  return (
    <FilterHeader
      filterName={filterName}
      children={renderContent()}
    />

  );
};

DateFilter.propTypes = {
  value: PropTypes.shape({
    from: PropTypes.objectOf(Date),
    to: PropTypes.objectOf(Date),
    preset: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  }),
  onCancel: PropTypes.func,
  onApply: PropTypes.func,
};

DateFilter.defaultProps = {
  onApply: noop,
  value: {
    preset: TODAY,
    ...presetToRange[TODAY]()
  }
};

export default DateFilter;
