import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import noop from 'lodash/noop';
import { connect } from 'react-redux';
import DayPicker, { DateUtils } from 'react-day-picker';
import { Segment, Grid, Header, Dropdown, Input, Button, Divider } from 'semantic-ui-react';

import 'react-day-picker/lib/style.css';
import { actions as filterActions, selectors as filterSelectors } from '../../../redux/modules/filters';

// TODO (yaniv -> oleg): need indication for user when clicking on a bad date (after today) or when typing bad dates

const format = 'DD-MM-YYYY';

const now = () =>
  moment(new Date())
    .hours(12)
    .minutes(0)
    .seconds(0)
    .milliseconds(0)
    .toDate();

const TODAY = 1;
const YESTERDAY = 2;
const LAST_7_DAYS = 3;
const LAST_30_DAYS = 4;
const LAST_MONTH = 5;
const THIS_MONTH = 6;
const CUSTOM_RANGE = 100;

const datePresets = {
  TODAY: { key: 1, text: 'Today', value: TODAY },
  YESTERDAY: { key: 2, text: 'Yesterday', value: YESTERDAY },
  LAST_7_DAYS: { key: 3, text: 'Last 7 Days', value: LAST_7_DAYS },
  LAST_30_DAYS: { key: 4, text: 'Last 30 Days', value: LAST_30_DAYS },
  LAST_MONTH: { key: 5, text: 'Last Month', value: LAST_MONTH },
  THIS_MONTH: { key: 6, text: 'This Month', value: THIS_MONTH },
  CUSTOM_RANGE: { key: 7, text: 'Custom Range', value: CUSTOM_RANGE },
};

const datePresetsOptions = Object.keys(datePresets).map(key => datePresets[key]);

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

const isValidDateRange = (fromValue, toValue) => {
  const fromMoment = moment(fromValue, format, true);
  const toMoment = moment(toValue, format, true);

  return fromMoment.isValid() &&
    toMoment.isValid() &&
    fromMoment.isSameOrBefore(toMoment) &&
    toMoment.isSameOrBefore(now());
};

class DateFilter extends Component {

  static propTypes = {
    namespace: PropTypes.string.isRequired,
    value: PropTypes.shape({
      from: PropTypes.objectOf(Date),
      to: PropTypes.objectOf(Date),
      dataPreset: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    }),
    onCancel: PropTypes.func,
    onApply: PropTypes.func,
    setFilterValue: PropTypes.func.isRequired
  };

  static defaultProps = {
    onCancel: noop,
    onApply: noop,
    value: {
      datePreset: TODAY,
      ...presetToRange[TODAY]()
    }
  }

  state = {
    fromInputValue: '',
    toInputValue: ''
  };

  setRange(datePreset, from, to, fromInputValue = '', toInputValue = '') {
    let range = {};
    if (datePreset === CUSTOM_RANGE) {
      range.from = from || this.props.value.from;
      range.to = to || this.props.value.to;
    } else {
      range = (presetToRange[datePreset] ? presetToRange[datePreset] : presetToRange[TODAY])();
    }

    // try to show entire range in calendar
    if (datePreset !== CUSTOM_RANGE || (datePreset === CUSTOM_RANGE && range && range.from)) {
      this.datePicker.showMonth(range.from);
    }

    const momentFrom = moment(new Date(range.from));
    const momentTo = moment(new Date(range.to));

    this.setState({
      fromInputValue: fromInputValue || (momentFrom.isValid() ? momentFrom.format(format) : ''),
      toInputValue: toInputValue || (momentTo.isValid() ? momentTo.format(format) : '')
    });

    this.props.setFilterValue(this.props.namespace, {
      ...range,
      datePreset,
    });
  }

  handleDayClick = (day) => {
    if (moment(day).isAfter(now())) {
      return;
    }

    const { from, to } = this.props.value;
    const range = DateUtils.addDayToRange(day, { from, to });

    this.setRange(CUSTOM_RANGE, range.from, range.to);
  };

  handleDatePresetsChange = (event, data) => this.setRange(data.value);

  handleFromInputChange = (event) => {
    const value = event.target.value;
    const momentValue = moment(value, format, true);

    const isValid = momentValue.isValid();
    if (isValid && isValidDateRange(value, this.state.toInputValue)) {
      this.setRange(
        CUSTOM_RANGE,
        momentValue.toDate(),
        moment(this.state.toInputValue, format, true).toDate(),
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
    const value = event.target.value;
    const momentValue = moment(value, format, true);

    const isValid = momentValue.isValid();
    if (isValid && isValidDateRange(this.state.fromInputValue, value)) {
      this.setRange(
        CUSTOM_RANGE,
        moment(this.state.fromInputValue, format, true).toDate(),
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

  canApply = () => isValidDateRange(this.state.fromInputValue, this.state.toInputValue);

  render() {
    const { fromInputValue, toInputValue } = this.state;
    const { onCancel, onApply, value } = this.props;
    const { from, to, datePreset } = value;

    return (
      <Segment basic attached="bottom" className="tab active">
        <Grid divided>
          <Grid.Row columns={16}>
            <Grid.Column width={11}>
              <DayPicker
                numberOfMonths={2}
                selectedDays={{ from, to }}
                onDayClick={this.handleDayClick}
                toMonth={now()}
                // eslint-disable-next-line no-return-assign
                ref={el => this.datePicker = el}
              />
            </Grid.Column>
            <Grid.Column width={5}>
              <Header textAlign="center">Select a start index</Header>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={16}>
                    <Dropdown fluid options={datePresetsOptions} item value={datePreset} onChange={this.handleDatePresetsChange} />
                    <Divider />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={8}>
                    <Input
                      value={fromInputValue}
                      onChange={this.handleFromInputChange}
                      fluid
                      placeholder="DD-MM-YYYY"
                    />
                  </Grid.Column>
                  <Grid.Column width={8}>
                    <Input
                      value={toInputValue}
                      onChange={this.handleToInputChange}
                      fluid
                      placeholder="DD-MM-YYYY"
                    />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column textAlign="right">
                    <Button type="button" onClick={onCancel}>Cancel</Button>
                    <Button type="button" primary disabled={!this.canApply()} onClick={onApply}>Apply</Button>
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

export default connect(
  (state, ownProps) => ({
    value: filterSelectors.getFilterValue(state.filters, ownProps.namespace)
  }),
  filterActions
)(DateFilter);
