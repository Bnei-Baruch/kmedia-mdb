import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import 'react-day-picker/lib/style.css';

const fromMonth = new Date(1970, 0);
const toMonth   = new Date(new Date().getFullYear(), 11);

const YearMonthForm = ({ date, onChange, localeUtils, language, className }) => {
  const month = date.getMonth();
  const year = date.getFullYear();

  const handleMonthChange = (e, data) => {
    onChange(new Date(year, data.value));
  };

  const handleYearChange = (e, data) => {
    onChange(new Date(data.value, month));
  };

  const months = localeUtils.getMonths(language);

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
        onChange={handleMonthChange}
      />
        &nbsp;&nbsp;
      <Dropdown
        compact
        inline
        scrolling
        options={years.map(yea => ({ text: yea, value: yea }))}
        value={year}
        onChange={handleYearChange}
      />
    </span>
  );
}

YearMonthForm.propTypes = {
  date: PropTypes.any.isRequired,
  localeUtils: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
};

export default YearMonthForm;
