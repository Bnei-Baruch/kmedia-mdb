import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import noop from 'lodash/noop';
import DayPicker, { DateUtils } from 'react-day-picker';
import { Segment, Grid, Header, Dropdown, Input, Button } from 'semantic-ui-react';
import 'react-day-picker/lib/style.css';

// TODO (yaniv -> oleg): need indication for user when clicking on a bad date (after today) or when typing bad dates

const format = 'DD-MM-YYYY';

const now = () => new Date();

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

class DateFilter extends Component {

  static propTypes = {
    onCancel: PropTypes.func,
    onApply: PropTypes.func
  };

  static defaultProps = {
    onCancel: noop,
    onApply: noop
  }

  state = {
    from: null,
    to: null,
    datePreset: null,
    fromInputValue: '',
    toInputValue: ''
  };

  componentDidMount() {
    this.setRange(TODAY);
  }

  setRange(datePreset, from, to, fromInputValue = '', toInputValue = '') {
    let range = {};
    if (datePreset === CUSTOM_RANGE) {
      range.from = from || this.state.from;
      range.to = to || this.state.to;
    } else {
      range = (presetToRange[datePreset] ? presetToRange[datePreset] : presetToRange[TODAY])();
    }

    // try to show entire range in calendar
    if (!from && !to && range && range.from) {
      this.datePicker.showMonth(range.from);
    }

    const momentFrom = moment(new Date(range.from));
    const momentTo = moment(new Date(range.to));

    this.setState({
      ...range,
      datePreset,
      fromInputValue: fromInputValue || (momentFrom.isValid() ? momentFrom.format(format) : ''),
      toInputValue: toInputValue || (momentTo.isValid() ? momentTo.format(format) : '')
    });
  }

  handleDayClick = (day) => {
    if (moment(day).isAfter(now())) {
      return;
    }

    const { from, to } = this.state;
    const range = DateUtils.addDayToRange(day, { from, to });
    this.setRange(CUSTOM_RANGE, range.from, range.to);
  };

  handleDatePresetsChange = (event, data) => this.setRange(data.value);

  handleFromInputChange = (event) => {
    const value = event.target.value;
    const momentValue = moment(value, format, true);

    const isValid = momentValue.isValid();

    // TODO (yaniv): test if toInputValue is valid date and set it as to

    this.setRange(
      CUSTOM_RANGE,
      isValid ? momentValue.toDate() : null,
      this.state.to,
      value,
      this.state.toInputValue
    );
  };

  handleToInputChange = (event) => {
    const value = event.target.value;
    const momentValue = moment(value, format, true);

    const isValid = momentValue.isValid();

    // TODO (yaniv): test if fromInputValue is valid date and set it as from

    this.setRange(
      CUSTOM_RANGE,
      this.state.from,
      isValid ? momentValue.toDate() : null,
      this.state.fromInputValue,
      value
    );
  };

  canApply = () => {
    const fromMoment = moment(this.state.fromInputValue, format, true);
    const toMoment = moment(this.state.toInputValue, format, true);

    return fromMoment.isValid() &&
      toMoment.isValid() &&
      fromMoment.isSameOrBefore(toMoment) &&
      toMoment.isSameOrBefore(now());
  };

  render() {
    const { from, to, fromInputValue, toInputValue } = this.state;
    const { onCancel, onApply } = this.props;

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
                    <Dropdown fluid options={datePresetsOptions} item value={this.state.datePreset} onChange={this.handleDatePresetsChange} />
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

export default DateFilter;
