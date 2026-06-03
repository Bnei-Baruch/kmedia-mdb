import PropTypes from 'prop-types';

const getYears = () => {
  const fromYear = 1970;
  const toYear   = new Date().getFullYear();
  const years    = [];
  for (let i = toYear; i >= fromYear; i -= 1) {
    years.push(i);
  }

  return years;
};

const getMonths = locale => Array.from({ length: 12 }, (_, i) =>
  new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date(2024, i))
);

const YearMonthForm = ({ date, onChange, locale, className }) => {
  const month = date.getMonth();
  const year  = date.getFullYear();

  const handleMonthChange = e => onChange(new Date(year, Number(e.target.value)));
  const handleYearChange  = e => onChange(new Date(Number(e.target.value), month));

  const months = getMonths(locale);
  const years  = getYears();

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
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </span>
  );
};

YearMonthForm.propTypes = {
  date     : PropTypes.instanceOf(Date).isRequired,
  onChange : PropTypes.func.isRequired,
  locale   : PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default YearMonthForm;
