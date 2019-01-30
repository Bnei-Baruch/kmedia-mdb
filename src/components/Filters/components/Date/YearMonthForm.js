import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import 'react-day-picker/lib/style.css';

const fromMonth = new Date(1970, 0);
const toMonth   = new Date(new Date().getFullYear(), 11);

class YearMonthForm extends Component {
  static propTypes = {
    date: PropTypes.any.isRequired,
    localeUtils: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired,
  };

  state = {
    month: this.props.date.getMonth(),
    year: this.props.date.getFullYear(),
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.date !== nextProps.date) {
      this.setState({
        month: nextProps.date.getMonth(),
        year: nextProps.date.getFullYear(),
      });
    }
  }

  handleMonthChange = (e, data) => {
    this.props.onChange(new Date(this.state.year, data.value));
  };

  handleYearChange = (e, data) => {
    this.props.onChange(new Date(data.value, this.state.month));
  };

  render() {
    const { localeUtils, language, className } = this.props;
    const months                               = localeUtils.getMonths(language);

    const years = [];
    for (let i = toMonth.getFullYear(); i >= fromMonth.getFullYear(); i -= 1) {
      years.push(i);
    }

    return (
      <span className={className}>
        <Dropdown
          compact
          inline
          scrolling
          options={months.map((month, i) => ({ text: month, value: i }))}
          value={this.state.month}
          onChange={this.handleMonthChange}
        />
        &nbsp;&nbsp;
        <Dropdown
          compact
          inline
          scrolling
          options={years.map(year => ({ text: year, value: year }))}
          value={this.state.year}
          onChange={this.handleYearChange}
        />
      </span>
    );
  }
}

export default YearMonthForm;
