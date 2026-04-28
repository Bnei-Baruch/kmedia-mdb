import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { clsx } from 'clsx';
import { withTranslation } from 'react-i18next';
import { noop } from '../../../../helpers/utils';

import 'react-day-picker/lib/style.css';
import FastDayPicker from './FastDayPicker';
import { CUSTOM_DAY, CUSTOM_RANGE, datePresets, isValidDateRange, presetToRange, rangeToPreset, TODAY } from './helper';

class DateFilter extends Component {
  static propTypes = {
    value   : PropTypes.shape({
      from      : PropTypes.objectOf(Date),
      to        : PropTypes.objectOf(Date),
      datePreset: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    }),
    onCancel: PropTypes.func,
    onApply : PropTypes.func,
    t       : PropTypes.func.isRequired,
    language: PropTypes.string.isRequired,
  };

  static defaultProps = {
    onCancel: noop,
    onApply : noop,
    value   : {
      datePreset: TODAY,
      ...presetToRange[TODAY]()
    }
  };

  static convertToStateObject = props => {
    const { value } = props;
    if (!value) {
      return {};
    }

    const { from, to, datePreset } = value;
    const preset                   = datePreset || rangeToPreset(from, to);
    return ({
      from,
      to,
      datePreset: preset,
      showRange : preset === CUSTOM_RANGE,
      showDay   : preset === CUSTOM_DAY,
    });
  };

  constructor(props, context) {
    super(props, context);
    this.state = DateFilter.convertToStateObject(props);
  }

  componentDidUpdate(prevProps) {
    if (this.props.value && this.props.value !== prevProps.value) {
      this.setState(DateFilter.convertToStateObject(this.props));
    }
  }

  onCancel = () => this.props.onCancel();

  setRange = (datePreset, from, to) => {
    let range = {};
    if (datePreset === CUSTOM_RANGE || datePreset === CUSTOM_DAY) {
      range.from = from || this.state.from;
      range.to   = to || this.state.to;
    } else {
      range = (presetToRange[datePreset] || presetToRange[TODAY])();
    }

    this.setState({
      ...range,
      datePreset,
    });
  };

  canApply = () => isValidDateRange(this.state.from, this.state.to);

  apply = () => {
    const { from, to, datePreset } = this.state;
    this.props.onApply({ from, to, datePreset });
  };

  handleDatePresetsChange = name => {
    this.hidePickers();
    this.setRange(name);
  };

  handleDayInputChange = value => {
    if (!value) {
      return;
    }

    this.setRange(CUSTOM_DAY, value, value);
  };

  handleFromInputChange = value => {
    if (!value) {
      return;
    }

    if (isValidDateRange(value, this.state.to)) {
      this.setRange(CUSTOM_RANGE, value, this.state.to);
    } else {
      this.setState({ from: value });
    }
  };

  handleToInputChange = value => {
    if (!value) {
      return;
    }

    if (isValidDateRange(this.state.from, value)) {
      this.setRange(CUSTOM_RANGE, this.state.from, value);
    } else {
      this.setState({ to: value });
    }
  };

  hidePickers = () => {
    this.setState({ showRange: false, showDay: false });
  };

  toggleRange = () => {
    const { showRange } = this.state;
    this.setState({ showRange: !showRange, showDay: false });
  };

  toggleDay = () => {
    const { showDay } = this.state;
    this.setState({ showDay: !showDay, showRange: false });
  };

  render() {
    const { t, language }          = this.props;
    const { from, to, datePreset } = this.state;

    return (
      <div className="filter-popup__wrapper border rounded shadow">
        <div className="filter-popup__header bg-gray-100 p-4">
          <div className="title">
            <button
              className="px-3 py-1 small border border-gray-300 rounded hover:bg-gray-50"
              onClick={this.onCancel}
            >
              {t('buttons.cancel')}
            </button>
            <h4 className="small text-center font-semibold">
              {t('filters.date-filter.label')}
            </h4>
            <button
              className="px-3 py-1 small bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={!this.canApply()}
              onClick={this.apply}
            >
              {t('buttons.apply')}
            </button>
          </div>
        </div>
        <div className="filter-popup__body date-filter p-4">
          <div className="flex flex-col">
            {
              datePresets.map(x => {
                const text = t(`filters.date-filter.presets.${x}`);
                return (
                  <div
                    key={x}
                    className={clsx(
                      'cursor-pointer px-3 py-2 small hover:bg-gray-100',
                      { 'bg-blue-50 font-semibold text-blue-600': datePreset === x }
                    )}
                    onClick={() => this.handleDatePresetsChange(x)}
                  >
                    {text}
                  </div>
                );
              })
            }
            <div className="border-t">
              <div
                className={clsx(
                  'cursor-pointer px-3 py-2 small font-semibold hover:bg-gray-100',
                  { 'text-blue-600': this.state.showDay }
                )}
                onClick={this.toggleDay}
              >
                {t('filters.date-filter.presets.CUSTOM_DAY')}
              </div>
              {this.state.showDay && (
                <div className="px-3 py-2">
                  <FastDayPicker
                    label={null}
                    value={from}
                    language={language}
                    onDayChange={this.handleDayInputChange}
                  />
                </div>
              )}
            </div>
            <div className="border-t">
              <div
                className={clsx(
                  'cursor-pointer px-3 py-2 small font-semibold hover:bg-gray-100',
                  { 'text-blue-600': this.state.showRange }
                )}
                onClick={this.toggleRange}
              >
                {t('filters.date-filter.presets.CUSTOM_RANGE')}
              </div>
              {this.state.showRange && (
                <div className="px-3 py-2">
                  <FastDayPicker
                    label={t('filters.date-filter.start')}
                    value={from}
                    language={language}
                    onDayChange={this.handleFromInputChange}
                  />
                  <br/>
                  <FastDayPicker
                    label={t('filters.date-filter.end')}
                    value={to}
                    language={language}
                    onDayChange={this.handleToInputChange}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(DateFilter);
