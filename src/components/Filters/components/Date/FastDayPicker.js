import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component, createRef } from 'react';
import { clsx } from 'clsx';
import Navbar from 'react-day-picker/build/Navbar';
import 'react-day-picker/lib/style.css';
import MomentLocaleUtils, { formatDate } from 'react-day-picker/moment';
import scrollIntoView from 'scroll-into-view';
import { noop } from '../../../../helpers/utils';

import { today } from '../../../../helpers/date';
import { getLanguageDirection, getLanguageLocaleWORegion } from '../../../../helpers/i18n-utils';
import YearMonthForm from './YearMonthForm';

import DayPicker from 'react-day-picker';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';

class FastDayPicker extends Component {
  static contextType = DeviceInfoContext;

  static propTypes = {
    value      : PropTypes.instanceOf(Date),
    label      : PropTypes.string,
    onDayChange: PropTypes.func,
    language   : PropTypes.string.isRequired,
  };

  static defaultProps = {
    value      : null,
    label      : '',
    onDayChange: noop,
  };

  constructor(props) {
    super(props);
    this.myRef = createRef();
  }

  state = {
    month      : null,
    isOpen     : false,
    value      : null,
    stringValue: '',
  };

  localeDateFormat      = moment.localeData().longDateFormat('L');
  localeDateFormatShort = this.localeDateFormat.replace('DD', 'D').replace('MM', 'M');

  static getDerivedStateFromProps(props, state) {
    const { value } = state;
    if (props.value !== value) {
      return { value: props.value, stringValue: FastDayPicker.formatDateValue(props.value, props.language) };
    }

    return null;
  }

  static formatDateValue(date, language) {
    const locale = getLanguageLocaleWORegion(language);
    return date ? formatDate(date, 'l', locale) : '';
  }

  handleYearMonthChange = month => {
    this.setState({ month });
  };

  handleDayPickerRef = () => {
    if (this.myRef) {
      scrollIntoView(this.myRef, {
        time       : 150, // half a second
        validTarget: target => target !== window,
      });
    }
  };

  handleNativeDateInputRef = ref => {
    this.nativeDateInput = ref;
  };

  handleNativeDateInputChange = event => {
    if (!event) {
      return;
    }

    this.props.onDayChange(event.target.valueAsDate);
  };

  openNativeDatePicker = () => {
    if (this.context.isAndroid) {
      this.nativeDateInput.click();
      return;
    }

    this.nativeDateInput.focus();
  };

  getNavBarElement = (props, language) => {
    const { month, localeUtils } = props;
    return (
      <div>
        <Navbar {...props} className="FastDayPicker-DayPicker-NavButton"/>
        <YearMonthForm
          date={month}
          language={language}
          localeUtils={localeUtils}
          onChange={this.handleYearMonthChange}
          className="float-left"
        />
        <div className="clear"/>
      </div>
    );
  };

  openPopup = () => this.setState({ isOpen: true });

  closePopup = () => this.setState({ isOpen: false });

  onPopupDayChange = date => {
    if (date > today().add(1, 'days').toDate()) {
      return;
    }

    const { onDayChange, language } = this.props;
    this.setState({ stringValue: FastDayPicker.formatDateValue(date, language) });
    onDayChange(date);
    this.closePopup();
  };

  handleDateInputChange = event => {
    const { onDayChange } = this.props;
    const val             = event.target.value;
    const day             = moment(val, this.localeDateFormatShort, true);
    if (day.isValid()) {
      onDayChange(day.toDate());
    } else {
      this.setState({ stringValue: val });
    }
  };

  handleKeyDown = () => {
    this.closePopup();
  };

  render() {
    const { language, value, label }     = this.props;
    const { month, isOpen, stringValue } = this.state;
    const locale                         = getLanguageLocaleWORegion(language);
    const { isMobileDevice }             = this.context;

    if (isMobileDevice) {
      const selected               = value || today().toDate();
      const selectedToString       = moment(selected).format('YYYY-MM-DD');
      const selectedInLocaleFormat = moment(selected).format(this.localeDateFormat);
      return (
        <div>
          <div className="flex">
            <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l small to-from-label">
              {label}
            </span>
            <input
              type="text"
              className="border border-gray-300 rounded-r px-3 py-1 small"
              readOnly
              value={selectedInLocaleFormat}
              onClick={this.openNativeDatePicker}
            />
          </div>
          <input
            className="hide-native-date-input"
            type="date"
            value={selectedToString}
            max={today().format('YYYY-MM-DD')}
            step="1"
            pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
            onChange={this.handleNativeDateInputChange}
            ref={this.handleNativeDateInputRef}
          />
        </div>
      );
    }

    return (
      <div className="relative">
        <div className="flex w-full items-center">
          {label && (
            <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l small to-from-label">
              {label}
            </span>
          )}
          <div className="relative flex-1">
            <input
              className={clsx('w-full border border-gray-300 px-3 py-1 small pr-8', label ? 'rounded-r' : 'rounded')}
              placeholder={`${formatDate(new Date(), 'l', locale)}`}
              value={stringValue}
              onChange={this.handleDateInputChange}
              onKeyDown={this.handleKeyDown}
              onFocus={this.openPopup}
            />
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none large">
              calendar_month
            </span>
          </div>
        </div>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={this.closePopup}/>
            <div className="absolute z-50 mt-1 bg-white border border-gray-300 rounded shadow-lg p-2">
              <div dir={getLanguageDirection(language)}>
                <DayPicker
                  locale={locale}
                  localeUtils={MomentLocaleUtils}
                  disabledDays={{ after: new Date() }}
                  captionElement={() => null}
                  navbarElement={props => this.getNavBarElement(props, language)}
                  month={month}
                  toMonth={today().toDate()}
                  ref={this.handleDayPickerRef}
                  onDayChange={this.onPopupDayChange}
                  onDayClick={this.onPopupDayChange}
                />
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
}

export default FastDayPicker;
