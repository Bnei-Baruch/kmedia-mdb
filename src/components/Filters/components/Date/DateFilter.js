import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import noop from 'lodash/noop';
import { Accordion, Button, Header, Menu, Segment } from 'semantic-ui-react';

import 'react-day-picker/lib/style.css';
import { today } from '../../../../helpers/date';
import FastDayPicker from './FastDayPicker';
import * as shapes from '../../../shapes';

const TODAY        = 'TODAY';
const YESTERDAY    = 'YESTERDAY';
const LAST_7_DAYS  = 'LAST_7_DAYS';
const LAST_30_DAYS = 'LAST_30_DAYS';
const LAST_MONTH   = 'LAST_MONTH';
const THIS_MONTH   = 'THIS_MONTH';
const CUSTOM_RANGE = 'CUSTOM_RANGE';

const datePresets = [
  TODAY,
  YESTERDAY,
  LAST_7_DAYS,
  LAST_30_DAYS,
  LAST_MONTH,
  THIS_MONTH,
  // CUSTOM_RANGE,
];

const presetToRange = {
  [TODAY]: () => {
    const nToday = today().toDate();
    return ({ from: nToday, to: nToday });
  },
  [YESTERDAY]: () => {
    const yesterday = today().subtract(1, 'days').toDate();
    return ({ from: yesterday, to: yesterday });
  },
  [LAST_7_DAYS]: () => ({
    from: today().subtract(6, 'days').toDate(),
    to: today().toDate()
  }),
  [LAST_30_DAYS]: () => ({
    from: today().subtract(29, 'days').toDate(),
    to: today().toDate()
  }),
  [LAST_MONTH]: () => {
    const minusMonth = today().subtract(1, 'months');
    return ({
      from: moment(minusMonth).startOf('month').toDate(),
      to: moment(minusMonth).endOf('month').toDate()
    });
  },
  [THIS_MONTH]: () => ({
    from: today().startOf('month').toDate(),
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
    } else if (mTo.isSame(moment(mNow).subtract(1, 'days'), 'day')) {
      return YESTERDAY;
    }
  } else if (moment(mTo).subtract(6, 'days').isSame(mFrom, 'day')) {
    return LAST_7_DAYS;
  } else if (moment(mTo).subtract(29, 'days').isSame(mFrom, 'day') && mTo.isSame(mNow, 'day')) {
    return LAST_30_DAYS;
  } else if (moment(mNow).startOf('month').isSame(mFrom, 'day') && mNow.isSame(to, 'day')) {
    return THIS_MONTH;
  }

  const minusMonth = moment(mNow).subtract(1, 'months');
  if (moment(minusMonth).startOf('month').isSame(mFrom, 'day') &&
    moment(minusMonth).endOf('month').isSame(to, 'day')) {
    return LAST_MONTH;
  }

  return CUSTOM_RANGE;
};

const isValidDateRange = (from, to) => {
  const mFrom = moment(from);
  const mTo   = moment(to);

  return mFrom.isValid() &&
    mTo.isValid() &&
    mFrom.isSameOrBefore(mTo, 'day') &&
    mTo.isSameOrBefore(today(), 'day');
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
    deviceInfo: shapes.UserAgentParserResults.isRequired,
  };

  static defaultProps = {
    onCancel: noop,
    onApply: noop,
    value: {
      datePreset: TODAY,
      ...presetToRange[TODAY]()
    }
  };

  constructor(props, context) {
    super(props, context);
    this.state = this.convertToStateObject(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.convertToStateObject(nextProps));
  }

  onCancel = () =>
    this.props.onCancel();

  setRange = (datePreset, from, to) => {
    // calculate range with regard to the date preset
    let range = {};
    if (datePreset === CUSTOM_RANGE) {
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

  canApply = () =>
    isValidDateRange(this.state.from, this.state.to);

  apply = () => {
    const { from, to, datePreset } = this.state;
    this.props.onApply({ from, to, datePreset });
  };

  convertToStateObject = (props) => {
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
      showCustom: preset === CUSTOM_RANGE,
    });
  };

  handleDatePresetsChange = (event, data) =>
    this.setRange(data.name);

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

  toggleCustom = () =>
    this.setState({ showCustom: !this.state.showCustom });

  render() {
    const { t, language, deviceInfo } = this.props;
    const { from, to, datePreset }    = this.state;

    return (
      <Segment.Group>
        <Segment secondary className="filter-popup__header">
          <div className="title">
            <Button
              basic
              compact
              icon="remove"
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
        <Segment className="filter-popup__body date-filter">
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
                active={this.state.showCustom}
                content={t('filters.date-filter.presets.CUSTOM_RANGE')}
                onClick={this.toggleCustom}
              />
              <Accordion.Content active={this.state.showCustom}>
                <FastDayPicker
                  label={t('filters.date-filter.start')}
                  value={from}
                  language={language}
                  deviceInfo={deviceInfo}
                  onDayChange={this.handleFromInputChange}
                />
                <br />
                <FastDayPicker
                  label={t('filters.date-filter.end')}
                  value={to}
                  language={language}
                  deviceInfo={deviceInfo}
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

export default DateFilter;
