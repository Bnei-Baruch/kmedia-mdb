import React, { Component }  from 'react';
import moment from 'moment';
import DayPicker, { DateUtils } from 'react-day-picker';
import { Segment, Grid, Header, Dropdown, Input } from 'semantic-ui-react';
import 'react-day-picker/lib/style.css';

const options = [
  { key: 1, text: 'Today', value: 1 },
  { key: 2, text: 'Yesterday', value: 2 },
  { key: 3, text: 'Last 7 Days', value: 3 },
  { key: 4, text: 'Last 30 Days', value: 4 },
  { key: 5, text: 'Last Month', value: 5 },
  { key: 6, text: 'This Month', value: 6 },
  { key: 7, text: 'Custom Range', value: 100 },
];


class DateFilter extends Component {

  state = {
    from: null,
    to: null,
    datePreset: options[0].value
  };

  handleDayClick = day => {
    const range = DateUtils.addDayToRange(day, this.state);
    this.setState(range);
  };

  handleResetClick = e => {
    e.preventDefault();
    this.setState({
      from: null,
      to: null,
    });
  };

  handleDatePresetsChange = (event, data) => {
    this.setState({ datePreset: data.value });
  }

  render() {
    const { from, to } = this.state;

    return (
      <Segment basic attached="bottom" className="tab active">
        <Grid divided>
          <Grid.Row columns={16}>
            <Grid.Column width={11}>
              <DayPicker
                numberOfMonths={2}
                selectedDays={[from, { from, to }]}
                onDayClick={this.handleDayClick}
              />
            </Grid.Column>
            <Grid.Column width={5}>
              <Header textAlign="center">Select a start index</Header>
              <Grid divided="vertically">
                <Grid.Row>
                  <Grid.Column width={16}>
                    <Dropdown fluid options={options} item value={this.state.datePreset} onChange={this.handleDatePresetsChange} />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={8}>
                    <Input value={from} fluid />
                  </Grid.Column>
                  <Grid.Column width={8}>
                    <Input value={to} fluid />
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
