import React, { Component } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import MomentLocaleUtils, { formatDate, parseDate } from 'react-day-picker/moment';
import { Input } from 'semantic-ui-react';
import 'react-day-picker/lib/style.css';

import { today } from '../../../../helpers/date';
import { getLanguageDirection, getLanguageLocaleWORegion } from '../../../../helpers/i18n-utils';
import YearMonthForm from './YearMonthForm';

class FastDayPicker extends Component {
  static propTypes = {
    value: PropTypes.instanceOf(Date),
    onDayChange: PropTypes.func,
    language: PropTypes.string.isRequired,
  };

  static defaultProps = {
    value: null,
    onDayChange: noop,
  };

  state = {
    month: null,
  };

  handleYearMonthChange = month =>
    this.setState({ month });

  render() {
    const { language, onDayChange, value } = this.props;
    const { month }                        = this.state;
    const selected                         = value || today().toDate();
    const locale                           = getLanguageLocaleWORegion(language);

    return (
      <DayPickerInput
        component={Input}
        value={selected}
        onDayChange={onDayChange}
        inputProps={{
          fluid: true,
          size: 'small'
        }}
        format="l"
        formatDate={formatDate}
        parseDate={parseDate}
        placeholder={`${formatDate(new Date(), 'l', locale)}`}
        dayPickerProps={{
          month,
          toMonth: today().toDate(),
          disabledDays: { after: today().toDate() },
          locale,
          localeUtils: MomentLocaleUtils,
          dir: getLanguageDirection(language),
          captionElement: ({ date, localeUtils }) => (
            <YearMonthForm
              date={date}
              localeUtils={localeUtils}
              onChange={this.handleYearMonthChange}
            />
          )
        }}
      />
    );
  }
}

export default FastDayPicker;
