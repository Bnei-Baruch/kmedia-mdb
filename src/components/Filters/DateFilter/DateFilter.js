import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import noop from 'lodash/noop';
import DayPicker, { DateUtils } from 'react-day-picker';
import LocaleUtils from 'react-day-picker/moment';
import { Button, Divider, Dropdown, Grid, Header, Input, Segment } from 'semantic-ui-react';

import 'react-day-picker/lib/style.css';

import { DATE_FORMAT, RTL_LANGUAGES } from '../../../helpers/consts';
import connectFilter from '../connectFilter';

// TODO (yaniv -> oleg): need indication for user when clicking on a bad date (after today) or when typing bad dates

// must be locale aware
const DATE_DISPLAY_FORMAT = 'l';

const now = () =>
  moment(new Date())
    .hours(12)
    .minutes(0)
    .seconds(0)
    .milliseconds(0)
    .toDate();

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
  CUSTOM_RANGE,
];

const presetToRange = {
  [TODAY]: () => {
    const today = moment().toDate();
    return ({ from: today, to: today });
  },
  [YESTERDAY]: () => {
    const yesterday = moment().subtract(1, 'days').toDate();
    return ({ from: yesterday, to: yesterday });
  },
  [LAST_7_DAYS]: () => ({
    from: moment().subtract(6, 'days').toDate(),
    to: moment().toDate()
  }),
  [LAST_30_DAYS]: () => ({
    from: moment().subtract(30, 'days').toDate(),
    to: moment().toDate()
  }),
  [LAST_MONTH]: () => {
    const todayMinusMonthMoment = moment().subtract(1, 'months');
    return ({
      from: todayMinusMonthMoment.startOf('month').toDate(),
      to: todayMinusMonthMoment.endOf('month').toDate()
    });
  },
  [THIS_MONTH]: () => ({
    from: moment().startOf('month').toDate(),
    to: moment().toDate()
  })
};

const rangeToPreset = (from, to) => {
  if (moment(from, 'day').isSame(to, 'day')) {
    if (moment(to).isSame(now(), 'day')) {
      return TODAY;
    } else if (moment(to).isSame(moment().subtract(1, 'days'), 'days')) {
      return YESTERDAY;
    }
  } else if (moment(to).subtract(6, 'days').isSame(from, 'day')) {
    return LAST_7_DAYS;
  } else if (moment(to).subtract(30, 'days').isSame(from, 'day') && moment(to).isSame(moment(), 'day')) {
    return LAST_30_DAYS;
  } else if (moment().startOf('month').isSame(from, 'day') && moment().isSame(to, 'day')) {
    return THIS_MONTH;
  }

  const todayMinusMonthMoment = moment().subtract(1, 'months');
  if (todayMinusMonthMoment.startOf('month').isSame(from, 'day') && todayMinusMonthMoment.endOf('month').isSame(to, 'day')) {
    return LAST_MONTH;
  }

  return CUSTOM_RANGE;
};

const isValidDateRange = (fromValue, toValue) => {
  const fromMoment = moment(fromValue, DATE_DISPLAY_FORMAT, true);
  const toMoment   = moment(toValue, DATE_DISPLAY_FORMAT, true);

  return fromMoment.isValid() &&
    toMoment.isValid() &&
    fromMoment.isSameOrBefore(toMoment) &&
    toMoment.isSameOrBefore(now());
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
    updateValue: PropTypes.func.isRequired,
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

  constructor(props, context) {
    super(props, context);
    this.state = this.convertToStateObject(this.props);
  }

  componentDidMount() {
    const { datePreset, from, to } = this.state;
    this.showMonth(datePreset, from, to);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.convertToStateObject(nextProps));
  }

  onCancel = () =>
    this.props.onCancel();

  setRange = (datePreset, from, to, fromInputValue = '', toInputValue = '') => {
    let range = {};

    // calculate range in regard to the date preset
    if (datePreset === CUSTOM_RANGE) {
      range.from = from || this.state.from;
      range.to   = to || this.state.to;
    } else {
      range = (presetToRange[datePreset] || presetToRange[TODAY])();
    }

    // try to show entire range in calendar
    if (datePreset !== CUSTOM_RANGE || (datePreset === CUSTOM_RANGE && range && range.from)) {
      this.showMonth(datePreset, range.from, range.to);
    }

    const momentFrom = moment(new Date(range.from));
    const momentTo   = moment(new Date(range.to));

    this.setState({
      ...range,
      datePreset,
      fromInputValue: fromInputValue || (momentFrom.isValid() ? momentFrom.format(DATE_DISPLAY_FORMAT) : ''),
      toInputValue: toInputValue || (momentTo.isValid() ? momentTo.format(DATE_DISPLAY_FORMAT) : '')
    });
  };

  convertToStateObject = (props) => {
    const { value: { from, to, datePreset } } = props;

    return ({
      from,
      to,
      datePreset: datePreset || rangeToPreset(from, to),
      fromInputValue: moment(from, DATE_FORMAT).format(DATE_DISPLAY_FORMAT),
      toInputValue: moment(to, DATE_FORMAT).format(DATE_DISPLAY_FORMAT)
    });
  };

  /**
   * decides how to show to the visible months in the calendar
   */
  showMonth = (preset, from, to) => {
    let dateToShow = from;
    // eslint-disable-next-line default-case
    switch (preset) {
    case TODAY:
    case YESTERDAY:
      dateToShow = moment(from).subtract(1, 'month').toDate();
      break;
    case LAST_7_DAYS:
    case LAST_30_DAYS:
      if (moment(from).month() < moment(to).month()) {
        dateToShow = from;
      } else {
        dateToShow = moment(from).subtract(1, 'month').toDate();
      }
      break;
    case LAST_MONTH:
      dateToShow = moment(now()).subtract(2, 'month').toDate();
      break;
    case THIS_MONTH:
      dateToShow = moment(now()).subtract(1, 'month').toDate();
      break;
    }

    this.datePicker.showMonth(dateToShow);
  };

  apply = () => {
    const { from, to, datePreset } = this.state;
    this.props.updateValue({ from, to, datePreset });
    this.props.onApply();
  };

  handleDayClick = (day) => {
    if (moment(day).isAfter(now())) {
      return;
    }

    const { from, to } = this.state;
    const range        = DateUtils.addDayToRange(day, { from, to });

    this.setRange(CUSTOM_RANGE, range.from, range.to);
  };

  handleDatePresetsChange = (event, data) => this.setRange(data.value);

  handleFromInputChange = (event) => {
    const value       = event.target.value;
    const momentValue = moment(value, DATE_DISPLAY_FORMAT, true);

    const isValid = momentValue.isValid();
    if (isValid && isValidDateRange(value, this.state.toInputValue)) {
      this.setRange(
        CUSTOM_RANGE,
        momentValue.toDate(),
        moment(this.state.toInputValue, DATE_DISPLAY_FORMAT, true).toDate(),
        value,
        this.state.toInputValue
      );
    } else {
      this.setState({
        fromInputValue: value
      });
    }
  };

  handleToInputChange = (event) => {
    const value       = event.target.value;
    const momentValue = moment(value, DATE_DISPLAY_FORMAT, true);

    const isValid = momentValue.isValid();
    if (isValid && isValidDateRange(this.state.fromInputValue, value)) {
      this.setRange(
        CUSTOM_RANGE,
        moment(this.state.fromInputValue, DATE_DISPLAY_FORMAT, true).toDate(),
        momentValue.toDate(),
        this.state.fromInputValue,
        value
      );
    } else {
      this.setState({
        toInputValue: value
      });
    }
  };

  canApply = () =>
    isValidDateRange(this.state.fromInputValue, this.state.toInputValue);

  render() {
    const { t, language } = this.props;
    const isRTL           = RTL_LANGUAGES.includes(language);

    const { fromInputValue, toInputValue, from, to, datePreset } = this.state;

    const i18nPresetsOptions = datePresets.map(x =>
      ({ text: t(`filters.date-filter.presets.${x}`), value: x }));

    return (
      <Segment basic attached="bottom" className="tab active">
        <Grid divided>
          <Grid.Row columns={16}>
            <Grid.Column width={11}>
              <DayPicker
                numberOfMonths={2}
                selectedDays={{ from, to }}
                disabledDays={{ after: new Date() }}
                toMonth={now()}
                localeUtils={LocaleUtils}
                locale={language}
                dir={isRTL ? 'rtl' : 'ltr'}
                onDayClick={this.handleDayClick}
                // eslint-disable-next-line no-return-assign
                ref={el => this.datePicker = el}
              />
            </Grid.Column>
            <Grid.Column width={5}>
              <Header content={t('filters.date-filter.selectTitle')} textAlign="center" />
              <Grid>
                <Grid.Row>
                  <Grid.Column width={16}>
                    <Dropdown
                      item
                      fluid
                      options={i18nPresetsOptions}
                      value={datePreset}
                      onChange={this.handleDatePresetsChange}
                    />
                    <Divider />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={8}>
                    <Input
                      fluid
                      placeholder={t('filters.date-filter.start')}
                      value={fromInputValue}
                      onChange={this.handleFromInputChange}
                    />
                  </Grid.Column>
                  <Grid.Column width={8}>
                    <Input
                      fluid
                      placeholder={t('filters.date-filter.end')}
                      value={toInputValue}
                      onChange={this.handleToInputChange}
                    />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column textAlign="right">
                    <Button content={t('buttons.close')} onClick={this.onCancel} />
                    <Button primary content={t('buttons.apply')} disabled={!this.canApply()} onClick={this.apply} />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

export default connectFilter()(DateFilter);
