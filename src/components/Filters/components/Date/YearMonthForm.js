import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import 'react-day-picker/lib/style.css';

const fromMonth = new Date(1970, 0);
const toMonth   = new Date(new Date().getFullYear(), 11);

class YearMonthForm extends Component {
  static propTypes = {
    date: PropTypes.any.isRequired, // eslint-disable-line react/forbid-prop-types
    localeUtils: PropTypes.any.isRequired, // eslint-disable-line react/forbid-prop-types
    onChange: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
    language: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      month: props.date.getMonth(),
      year: props.date.getFullYear(),
      date: props.date,
    };
  }

  static getDerivedStateFromProps(nextProps, state) {
    if (state.date !== nextProps.date) {
      return {
        month: nextProps.date.getMonth(),
        year: nextProps.date.getFullYear(),
        date: nextProps.date,
      };
    }
    return null;
  }

  handleMonthChange = (e, data) => {
    const { props, state } = this;
    props.onChange(new Date(state.year, data.value));
  };

  handleYearChange = (e, data) => {
    const { props, state } = this;
    props.onChange(new Date(data.value, state.month));
  };

  render() {
    const { state: { month, year }, props: { localeUtils, language, className } } = this;
    const months                                                                  = localeUtils.getMonths(language);

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
          options={months.map((mon, i) => ({ text: mon, value: i }))}
          value={month}
          onChange={this.handleMonthChange}
        />
        &nbsp;&nbsp;
        <Dropdown
          compact
          inline
          scrolling
          options={years.map(yea => ({ text: yea, value: yea }))}
          value={year}
          onChange={this.handleYearChange}
        />
      </span>
    );
  }
}

export default YearMonthForm;
