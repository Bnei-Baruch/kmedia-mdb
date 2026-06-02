import React from 'react';
import PropTypes from 'prop-types';
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

const YearMonthForm = ({ date, onChange, localeUtils, uiLang, className }) => {
  const month = date.getMonth();
  const year = date.getFullYear();

  const handleMonthChange = e => {
    onChange(new Date(year, Number(e.target.value)));
  };

  const handleYearChange = e => {
    onChange(new Date(Number(e.target.value), month));
  };

  const months = localeUtils.getMonths(uiLang);
  const years = getYears();

  return (
    <span className={className}>
      <select
        className="inline-block small border-none bg-transparent cursor-pointer"
        value={month}
        onChange={handleMonthChange}
      >
        {months.map((mon, i) => (
          <option key={i} value={i}>{mon}</option>
        ))}
      </select>
        &nbsp;&nbsp;
      <select
        className="inline-block small border-none bg-transparent cursor-pointer"
        value={year}
        onChange={handleYearChange}
      >
        {years.map(y => (
          <option key={y.value} value={y.value}>{y.text}</option>
        ))}
      </select>
    </span>
  );
}

YearMonthForm.propTypes = {
  date: PropTypes.any.isRequired,
  localeUtils: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  uiLang: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
};

export default YearMonthForm;
