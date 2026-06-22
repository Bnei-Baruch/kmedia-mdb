import dayjs from '../../../../helpers/dayjs';
import PropTypes from 'prop-types';
import { Component, createRef } from 'react';
import { clsx } from 'clsx';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import scrollIntoView from 'scroll-into-view';
import { noop } from '../../../../helpers/utils';

import { today } from '../../../../helpers/date';
import { getDayPickerLocale } from '../../../../helpers/dayPickerLocale';
import { getLanguageDirection, getLanguageLocaleWORegion } from '../../../../helpers/i18n-utils';

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

  // Getters so the format tracks the global dayjs locale set on language change.
  get localeDateFormat() {
    return dayjs().localeData().longDateFormat('L');
  }

  get localeDateFormatShort() {
    return this.localeDateFormat.replace('DD', 'D').replace('MM', 'M');
  }

  static getDerivedStateFromProps(props, state) {
    const { value } = state;
    if (props.value !== value) {
      return { value: props.value, stringValue: FastDayPicker.formatDateValue(props.value, props.language) };
    }

    return null;
  }

  static formatDateValue(date, language) {
    if (!date) return '';
    const locale = getLanguageLocaleWORegion(language);
    return dayjs(date).locale(locale).format('l');
  }

  handleDayPickerRef = () => {
    if (this.myRef) {
      scrollIntoView(this.myRef, {
        time       : 150,
        validTarget: target => target !== window,
      });
    }
  };

  handleNativeDateInputRef = ref => {
    this.nativeDateInput = ref;
  };

  handleNativeDateInputChange = event => {
    if (!event) return;
    this.props.onDayChange(event.target.valueAsDate);
  };

  openNativeDatePicker = () => {
    this.nativeDateInput?.showPicker?.();
  };

  openPopup = () => this.setState({ isOpen: true });

  closePopup = () => this.setState({ isOpen: false });

  onPopupDayChange = date => {
    if (!date || date > today().add(1, 'days').toDate()) return;

    const { onDayChange, language } = this.props;
    this.setState({ stringValue: FastDayPicker.formatDateValue(date, language) });
    onDayChange(date);
    this.closePopup();
  };

  handleDateInputChange = event => {
    const { onDayChange } = this.props;
    const val             = event.target.value;
    const day             = dayjs(val, this.localeDateFormatShort, true);
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
    const { isMobile }             = this.context;

    if (isMobile) {
      const selected               = value || today().toDate();
      const selectedToString       = dayjs(selected).format('YYYY-MM-DD');
      const selectedInLocaleFormat = dayjs(selected).locale(locale).format(this.localeDateFormat);
      return (
        <div>
          <div className="flex">
            <span className="inline-flex items-center self-stretch px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l small to-from-label">
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
            <span className="inline-flex items-center self-stretch px-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l small min-w-14">
              {label}
            </span>
          )}
          <div className="relative flex-1">
            <input
              className={clsx('w-full border border-gray-300 px-3 py-1 small pr-8', label ? 'rounded-r' : 'rounded')}
              placeholder={dayjs(new Date()).locale(locale).format('l')}
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
            <div className="absolute z-50 bottom-full mb-1 bg-white border border-gray-300 rounded shadow-lg p-2">
              <div dir={getLanguageDirection(language)}>
                <DayPicker
                  mode="single"
                  captionLayout="dropdown"
                  locale={getDayPickerLocale(language)}
                  disabled={{ after: new Date() }}
                  month={month || value || undefined}
                  endMonth={today().toDate()}
                  selected={value}
                  onSelect={this.onPopupDayChange}
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
