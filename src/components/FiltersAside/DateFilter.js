import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'next-i18next';
import { noop } from '../../helpers/utils';
import { Accordion, Checkbox, Icon, List, Segment } from 'semantic-ui-react';

import 'react-day-picker/lib/style.css';
import {
  CUSTOM_DAY,
  CUSTOM_RANGE,
  datePresets,
  isValidDateRange,
  presetToRange,
  rangeToPreset,
  TODAY
} from '../Filters/components/Date/helper';
import { FN_DATE_FILTER } from '../../helpers/consts';
import FastDayPicker from '../Filters/components/Date/FastDayPicker';
import { useDispatch, useSelector } from 'react-redux';
import { selectors as settings } from '../../../lib/redux/slices/settingsSlice/settingsSlice';
import { selectors as filtersAside } from '../../redux/modules/filtersAside';
import { actions, selectors as filters } from '../../redux/modules/filters';
import FilterHeader from './FilterHeader';
import { isLanguageRtl } from '../../helpers/i18n-utils';

const ENABLED_STATS_NAMESPACE = ['search'];

const DateFilter = ({ t, namespace }) => {
  const [to, setTo]               = useState();
  const [from, setFrom]           = useState();
  const [preset, setPreset]       = useState();
  const [showRange, setShowRange] = useState(false);
  const [showDay, setShowDay]     = useState(false);

  const selected = useSelector(state => filters.getFilterByName(state.filters, namespace, FN_DATE_FILTER));

  const uiLang = useSelector(state => settings.getUILang(state.settings));

  const stats = useSelector(state => filtersAside.getMultipleStats(state.filtersAside, namespace, FN_DATE_FILTER)(datePresets));

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

  const handleDatePresetsChange = (event, { value, checked }) => {
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

  const iconName      = `caret ${isLanguageRtl(uiLang) ? 'left' : 'right'}`;
  const renderContent = () => (
    <Segment.Group className="filter-popup__wrapper">
      {
        datePresets.map((x, i) => (
          <List.Item key={`${FN_DATE_FILTER}_${i}`}>
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
      filterName={FN_DATE_FILTER}
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
  t: PropTypes.func.isRequired,
};

DateFilter.defaultProps = {
  onApply: noop,
  value: {
    preset: TODAY,
    ...presetToRange[TODAY]()
  }
};

export default withTranslation()(DateFilter);
