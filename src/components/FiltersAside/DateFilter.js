import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { noop } from '../../helpers/utils';

import 'react-day-picker/lib/style.css';
import { useDispatch, useSelector } from 'react-redux';
import { FN_DATE_FILTER } from '../../helpers/consts';
import { isLanguageRtl } from '../../helpers/i18n-utils';
import { actions } from '../../redux/modules/filters';
import { filtersAsideGetMultipleStatsSelector, filtersGetFilterByNameSelector, settingsGetUILangSelector } from '../../redux/selectors';
import FastDayPicker from '../Filters/components/Date/FastDayPicker';
import {
  CUSTOM_DAY,
  CUSTOM_RANGE,
  datePresets,
  isValidDateRange,
  presetToRange,
  rangeToPreset,
  TODAY
} from '../Filters/components/Date/helper';
import FilterHeader from './FilterHeader';

const ENABLED_STATS_NAMESPACE = ['search'];

const DateFilter = ({ namespace }) => {
  const { t } = useTranslation();
  const [to, setTo]               = useState();
  const [from, setFrom]           = useState();
  const [preset, setPreset]       = useState();
  const [showRange, setShowRange] = useState(false);
  const [showDay, setShowDay]     = useState(false);

  const selected = useSelector(state => filtersGetFilterByNameSelector(state, namespace, FN_DATE_FILTER));

  const uiLang = useSelector(settingsGetUILangSelector);

  const stats = useSelector(state => filtersAsideGetMultipleStatsSelector(state, namespace, FN_DATE_FILTER, datePresets));

  const dispatch = useDispatch();

  useEffect(() => {
    const r = selected?.values?.[0];
    const p = rangeToPreset(r?.from, r?.to);
    setFrom(r?.from);
    setTo(r?.to);
    setPreset(r ? p : null);
    setShowRange(p === CUSTOM_RANGE);
    setShowDay(p === CUSTOM_DAY);
  }, [selected]);

  const updateFilter = (_preset, _from, _to) => {
    const r = buildRange(_preset, _from, _to);
    dispatch(actions.setFilterValue(namespace, FN_DATE_FILTER, r));
  };

  const buildRange = (_preset, _from = from, _to = to) => {
    if (!_preset) return null;
    // calculate range with regard to the date preset
    if (_preset === CUSTOM_RANGE || _preset === CUSTOM_DAY) {
      return { from: _from, to: _to };
    }

    return (presetToRange[_preset] || presetToRange[TODAY])();

  };

  const handleDatePresetsChange = event => {
    let { value } = event.target;
    const { checked } = event.target;
    setShowRange(false);
    setShowDay(false);
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

    if (isValidDateRange(value, to)) {
      updateFilter(CUSTOM_RANGE, value, to);
    } else {
      setFrom(value);
    }
  };

  const handleToInputChange = value => {
    if (!value) {
      return;
    }

    if (isValidDateRange(from, value)) {
      updateFilter(CUSTOM_RANGE, from, value);
    } else {
      setTo(value);
    }
  };

  const toggleRange = () => {
    setShowRange(!showRange);
    setShowDay(false);
  };

  const toggleDay = () => {
    setShowRange(false);
    setShowDay(!showDay);
  };

  const iconName      = isLanguageRtl(uiLang) ? 'arrow_left' : 'arrow_right';
  const renderContent = () => (
    <div className="filter-popup__wrapper border rounded bg-white p-4">
      {
        datePresets.map((x, i) =>
          (
            <li key={`${FN_DATE_FILTER}_${i}`}>
              <div className="date-filter-presets">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preset === x}
                    value={x}
                    onChange={handleDatePresetsChange}
                  />
                  {t(`filters.date-filter.presets.${x}`)}
                </label>
                {ENABLED_STATS_NAMESPACE.includes(namespace) && <span className="stat">{`(${stats[i]})`}</span>}
              </div>
            </li>
          )
        )
      }
      <ul className="date-filter">
        <li>
          <div
            className="cursor-pointer flex items-center"
            onClick={toggleDay}
          >
            {t('filters.date-filter.presets.CUSTOM_DAY')}
            <span className="material-symbols-outlined text-blue-500">{iconName}</span>
          </div>
          {showDay && (
            <div>
              <FastDayPicker
                label={null}
                value={from}
                language={uiLang}
                onDayChange={handleDayInputChange}
              />
            </div>
          )}
        </li>
        <li>
          <div
            className="cursor-pointer flex items-center"
            onClick={toggleRange}
          >
            {t('filters.date-filter.presets.CUSTOM_RANGE')}
            <span className="material-symbols-outlined text-blue-500">{iconName}</span>
          </div>
          {showRange && (
            <div>
              <FastDayPicker
                label={t('filters.date-filter.start')}
                value={from}
                language={uiLang}
                onDayChange={handleFromInputChange}
              />
              <br/>
              <FastDayPicker
                label={t('filters.date-filter.end')}
                value={to}
                language={uiLang}
                onDayChange={handleToInputChange}
              />
            </div>
          )}
        </li>
      </ul>
    </div>
  );
  return (
    <FilterHeader
      filterName={FN_DATE_FILTER}
      children={renderContent()}
    />

  );
};

DateFilter.propTypes = {
  value   : PropTypes.shape({
    from  : PropTypes.objectOf(Date),
    to    : PropTypes.objectOf(Date),
    preset: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  }),
  onCancel: PropTypes.func,
  onApply : PropTypes.func,
};

DateFilter.defaultProps = {
  onApply: noop,
  value  : {
    preset: TODAY,
    ...presetToRange[TODAY]()
  }
};

export default DateFilter;
