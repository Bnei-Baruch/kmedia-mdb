import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { noop } from '../../helpers/utils';
import { Accordion, Checkbox, List, Menu, Segment } from 'semantic-ui-react';

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
import { selectors as settings } from '../../redux/modules/settings';
import { actions, selectors as filters } from '../../redux/modules/filters';

const DateFilter = ({ t, namespace }) => {
  const [to, setTo]               = useState();
  const [from, setFrom]           = useState();
  const [preset, setPreset]       = useState();
  const [showRange, setShowRange] = useState(false);
  const [showDay, setShowDay]     = useState(false);

  const selected = useSelector(state => filters.getFilterByName(state.filters, namespace, FN_DATE_FILTER));

  const language = useSelector(state => settings.getLanguage(state.settings));

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

  return (
    <Segment.Group className="filter-popup__wrapper filter_aside">
      <List.Header className="title" content={t(`filters.aside-titles.${FN_DATE_FILTER}`)} />
      {
        datePresets.map((x, i) => (
          <List.Item key={`${FN_DATE_FILTER}_${i}`}>
            <List.Content>
              <Checkbox
                label={t(`filters.date-filter.presets.${x}`)}
                checked={preset === x}
                value={x}
                onChange={handleDatePresetsChange}
              />
            </List.Content>
          </List.Item>
        )
        )
      }
      <Segment basic className="filter-popup__body date-filter">
        <Accordion as={Menu} vertical fluid size="small">
          <Menu.Item>
            <Accordion.Title
              active={showDay}
              content={t('filters.date-filter.presets.CUSTOM_DAY')}
              onClick={toggleDay}
            />
            <Accordion.Content active={showDay}>
              <FastDayPicker
                label={null}
                value={from}
                language={language}
                onDayChange={handleDayInputChange}
              />
            </Accordion.Content>

          </Menu.Item>
          <Menu.Item>
            <Accordion.Title
              active={showRange}
              content={t('filters.date-filter.presets.CUSTOM_RANGE')}
              onClick={toggleRange}
            />
            <Accordion.Content active={showRange}>
              <FastDayPicker
                label={t('filters.date-filter.start')}
                value={from}
                language={language}
                onDayChange={handleFromInputChange}
              />
              <br />
              <FastDayPicker
                label={t('filters.date-filter.end')}
                value={to}
                language={language}
                onDayChange={handleToInputChange}
              />
            </Accordion.Content>
          </Menu.Item>
        </Accordion>
      </Segment>
    </Segment.Group>
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
  language: PropTypes.string.isRequired,
};

DateFilter.defaultProps = {
  onApply: noop,
  value: {
    preset: TODAY,
    ...presetToRange[TODAY]()
  }
};

export default withNamespaces()(DateFilter);
