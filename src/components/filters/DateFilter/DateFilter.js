import React, { Component }  from 'react';
import moment from 'moment';
import DayPicker, { DateUtils } from 'react-day-picker';
import { Segment, Grid, Header, Dropdown, Input, Button } from 'semantic-ui-react';
import 'react-day-picker/lib/style.css';

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

const ranges = {
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

  state = {
    from: null,
    to: null,
    datePreset: null
  };

  componentDidMount() {
    this.setRange(TODAY);
  }

  setRange(datePreset, from, to) {
    let range = (ranges[datePreset] ? ranges[datePreset] : ranges[TODAY])();
    if (datePreset === CUSTOM_RANGE) {
      range = {};
      if (from) {
        range.from = from;
      }

      if (to) {
        range.to = to;
      }
    }

    // try to show all range in calendar
    if (!from && !to) {
      this.datePicker.showMonth(range.from);
    }

    this.setState({ ...range, datePreset });
  }

  handleDayClick = (day) => {
    const { from, to } = this.state;
    const range = DateUtils.addDayToRange(day, { from, to });
    this.setRange(CUSTOM_RANGE, range.from, range.to);
  };

  handleDatePresetsChange = (event, data) => {
    this.setRange(data.value);
  };

  render() {
    const { from, to } = this.state;

    return (
      <Segment basic attached="bottom" className="tab active">
        <Grid divided>
          <Grid.Row columns={16}>
            <Grid.Column width={11}>
              <DayPicker
                numberOfMonths={2}
                selectedDays={{ from, to }}
                onDayClick={this.handleDayClick}
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
                    <Input value={moment(new Date(from)).format('DD-MM-YYYY')} fluid />
                  </Grid.Column>
                  <Grid.Column width={8}>
                    <Input value={moment(new Date(to)).format('DD-MM-YYYY')} fluid />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column textAlign="right">
                    <Button type="button">Cancel</Button>
                    <Button type="button" primary>Apply</Button>
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
