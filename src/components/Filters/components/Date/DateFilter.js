import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';
import noop from 'lodash/noop';
import { Accordion, Button, Header, Menu, Segment } from 'semantic-ui-react';

import 'react-day-picker/lib/style.css';
import { today } from '../../../../helpers/date';
import FastDayPicker from './FastDayPicker';

const TODAY        = 'TODAY';
const YESTERDAY    = 'YESTERDAY';
const LAST_7_DAYS  = 'LAST_7_DAYS';
const LAST_30_DAYS = 'LAST_30_DAYS';
const CUSTOM_RANGE = 'CUSTOM_RANGE';
const CUSTOM_DAY   = 'CUSTOM_DAY';

const datePresets = [
  TODAY,
  LAST_7_DAYS,
  LAST_30_DAYS
];

const presetToRange = {
  [TODAY]: () => {
    const nToday = today().toDate();
    return ({ from: nToday, to: nToday });
  },
  [LAST_7_DAYS]: () => ({
    from: today().subtract(6, 'days').toDate(),
    to: today().toDate()
  }),
  [LAST_30_DAYS]: () => ({
    from: today().subtract(29, 'days').toDate(),
    to: today().toDate()
  })
};

const rangeToPreset = (from, to) => {
  const mFrom = moment(from);
  const mTo   = moment(to);
  const mNow  = today();

  if (mFrom.isSame(mTo, 'day')) {
    if (mTo.isSame(mNow, 'day')) {
      return TODAY;
    }
    if (mTo.isSame(moment(mNow).subtract(1, 'days'), 'day')) {
      return YESTERDAY;
    }
  } else if (moment(mTo).subtract(6, 'days').isSame(mFrom, 'day')) {
    return LAST_7_DAYS;
  } else if (moment(mTo).subtract(29, 'days').isSame(mFrom, 'day') && mTo.isSame(mNow, 'day')) {
    return LAST_30_DAYS;
  }

  if (mFrom.isSame(mTo, 'day')) {
    return CUSTOM_DAY;
  }

  return CUSTOM_RANGE;
};

const isValidDateRange = (from, to) => {
  const mFrom = moment(from);
  const mTo   = moment(to);

  return mFrom.isValid()
    && mTo.isValid()
    && mFrom.isSameOrBefore(mTo, 'day')
    && mTo.isSameOrBefore(today(), 'day');
};

class DateFilter extends Component {
  static propTypes = {
    value: PropTypes.shape({
      from: PropTypes.objectOf(Date),
      to: PropTypes.objectOf(Date),
      datePreset: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    }),
    onCancel: PropTypes.func,
    onApply: PropTypes.func,
    t: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired,
  };

  static defaultProps = {
    onCancel: noop,
    onApply: noop,
    value: {
      datePreset: TODAY,
      ...presetToRange[TODAY]()
    }
  };

  static convertToStateObject = (props) => {
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
      showRange: preset === CUSTOM_RANGE,
      showDay: preset === CUSTOM_DAY,
    });
  };

  constructor(props, context) {
    super(props, context);
    this.state = DateFilter.convertToStateObject(props);
  }

  componentDidUpdate(prevProps) {
    if (this.props.value && this.props.value !== prevProps.value){
      this.setState(DateFilter.convertToStateObject(this.props));
    }
  }

  onCancel = () => this.props.onCancel();

  setRange = (datePreset, from, to) => {
    // calculate range with regard to the date preset
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

  handleDatePresetsChange = (event, data) => {
    this.hidePickers();
    this.setRange(data.name);
  };

  handleDayInputChange = (value) => {
    if (!value) {
      return;
    }

    this.setRange(CUSTOM_DAY, value, value);
  };

  handleFromInputChange = (value) => {
    if (!value) {
      return;
    }

    if (isValidDateRange(value, this.state.to)) {
      this.setRange(CUSTOM_RANGE, value, this.state.to);
    } else {
      this.setState({ from: value });
    }
  };

  handleToInputChange = (value) => {
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
    const { t, language }             = this.props;
    const { from, to, datePreset }    = this.state;

    return (
      <Segment.Group className="filter-popup__wrapper">
        <Segment basic secondary className="filter-popup__header">
          <div className="title">
            <Button
              basic
              compact
              size="tiny"
              content={t('buttons.cancel')}
              onClick={this.onCancel}
            />
            <Header size="small" textAlign="center" content={t('filters.date-filter.label')} />
            <Button
              primary
              compact
              size="small"
              content={t('buttons.apply')}
              disabled={!this.canApply()}
              onClick={this.apply}
            />
          </div>
        </Segment>
        <Segment basic className="filter-popup__body date-filter">
          <Accordion as={Menu} vertical fluid size="small">
            {
              datePresets.map((x) => {
                const text = t(`filters.date-filter.presets.${x}`);
                return (
                  <Menu.Item
                    key={x}
                    name={x}
                    active={datePreset === x}
                    onClick={this.handleDatePresetsChange}
                  >
                    {text}
                  </Menu.Item>
                );
              })
            }
            <Menu.Item>
              <Accordion.Title
                active={this.state.showDay}
                content={t('filters.date-filter.presets.CUSTOM_DAY')}
                onClick={this.toggleDay}
              />
              <Accordion.Content active={this.state.showDay}>
                <FastDayPicker
                  label={null}
                  value={from}
                  language={language}
                  onDayChange={this.handleDayInputChange}
                />
              </Accordion.Content>

            </Menu.Item>
            <Menu.Item>
              <Accordion.Title
                active={this.state.showRange}
                content={t('filters.date-filter.presets.CUSTOM_RANGE')}
                onClick={this.toggleRange}
              />
              <Accordion.Content active={this.state.showRange}>
                <FastDayPicker
                  label={t('filters.date-filter.start')}
                  value={from}
                  language={language}
                  onDayChange={this.handleFromInputChange}
                />
                <br />
                <FastDayPicker
                  label={t('filters.date-filter.end')}
                  value={to}
                  language={language}
                  onDayChange={this.handleToInputChange}
                />
              </Accordion.Content>
            </Menu.Item>
          </Accordion>
        </Segment>
      </Segment.Group>
    );
  }
}

export default withNamespaces()(DateFilter);
