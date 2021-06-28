import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import 'react-day-picker/lib/style.css';


const getYears = () => {
  const fromYear = 1970;
  const toYear   = new Date().getFullYear();
  const years = [];

  for (let i = toYear; i >= fromYear; i -= 1) {
    years.push({ text: i, value: i });
  }

  return years;
};

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
  const years = getYears();

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
        options={years}
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
