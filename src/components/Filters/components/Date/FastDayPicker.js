import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import moment from 'moment';
import scrollIntoView from 'scroll-into-view';
import Navbar from 'react-day-picker/lib/src/Navbar';
import MomentLocaleUtils, { formatDate } from 'react-day-picker/moment';
import { Input, Segment, Popup, Label } from 'semantic-ui-react';
import 'react-day-picker/lib/style.css';

import { today } from '../../../../helpers/date';
import { getLanguageDirection, getLanguageLocaleWORegion } from '../../../../helpers/i18n-utils';
import * as shapes from '../../../shapes';
import YearMonthForm from './YearMonthForm';

import DayPicker from 'react-day-picker';

class FastDayPicker extends Component {
  static propTypes = {
    value: PropTypes.instanceOf(Date),
    label: PropTypes.string,
    onDayChange: PropTypes.func,
    language: PropTypes.string.isRequired,
    deviceInfo: shapes.UserAgentParserResults.isRequired,
  };

  static defaultProps = {
    value: null,
    label: '',
    onDayChange: noop,
  };

  state = {
    month: null,
    isOpen: false,
    value: null,
    stringValue: null,
  };

  localeDateFormat = moment.localeData().longDateFormat('L');
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

  isMobileDevice = () => this.props.deviceInfo.device && this.props.deviceInfo.device.type === 'mobile';

  handleYearMonthChange = (month) => {
    this.setState({ month });
  };

  handleDayPickerRef = (ref) => {
    if (ref) {
      scrollIntoView(ReactDOM.findDOMNode(ref), {
        time: 150, // half a second
        validTarget: target => target !== window,
      });
    }
  };

  handleNativeDateInputRef = (ref) => {
    this.nativeDateInput = ref;
  };

  handleNativeDateInputChange = (event) => {
    if (!event) {
      return;
    }

    this.props.onDayChange(event.target.valueAsDate);
  };

  openNativeDatePicker = () => {
    if (this.props.deviceInfo.os.name === 'Android') {
      this.nativeDateInput.click();
      return;
    }

    this.nativeDateInput.focus();
  };

  getOverlayComponent = props => (
    (
      <Segment>
        {props.children}
      </Segment>
    )
  );

  getNavBarElement = (props, language) => {
    const { month, localeUtils } = props;
    return (
      <div>
        <Navbar {...props} className="FastDayPicker-DayPicker-NavButton" />
        <YearMonthForm
          date={month}
          language={language}
          localeUtils={localeUtils}
          onChange={this.handleYearMonthChange}
          className="float-left"
        />
        <div className="clear" />
      </div>
    );
  };

  openPopup = () => this.setState({ isOpen: true });

  closePopup = () => this.setState({ isOpen: false });

  onPopupDayChange = (date) => {
    if (date > today().add(1, 'days').toDate())
      return;
    const { onDayChange, language } = this.props;
    this.setState({ stringValue: FastDayPicker.formatDateValue(date, language) });
    onDayChange(date);
    this.closePopup();
  }

  handleDateInputChange = (event, data) => {
    const { onDayChange } = this.props;    
    const day = moment(data.value, this.localeDateFormatShort, true);
    if (day.isValid()) {
      onDayChange(day.toDate());
    } else {
      this.setState({ stringValue: data.value });
    }
  };

  handleKeyDown = () => {
    this.closePopup();
  }

  render() {
    const { language, value, label } = this.props;
    const { month, isOpen, stringValue } = this.state;
    const locale = getLanguageLocaleWORegion(language);
    const isMobileDevice = this.isMobileDevice();

    if (isMobileDevice) {
      const selected = value || today().toDate();
      const selectedToString = moment(selected).format('YYYY-MM-DD');
      const selectedInLocaleFormat = moment(selected).format(this.localeDateFormat);
      return (
        <div>
          <div className="ui labeled input">
            <div className="ui label label to-from-label">
              {label}
            </div>
            <input
              type="text"
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
      <Popup
        basic
        flowing
        on='focus'
        open={isOpen}
        onOpen={this.openPopup}
        onClose={this.closePopup}
        trigger={
          <Input
            fluid
            size="small"
            icon="calendar alternate outline"
            placeholder={`${formatDate(new Date(), 'l', locale)}`}
            value={stringValue}
            onChange={this.handleDateInputChange}
            onKeyDown={this.handleKeyDown}
            format="l"
            overlayComponent={this.getOverlayComponent}
            showOverlay
            label={label ? <Label className="ui label label to-from-label">{label}</Label> : null}
          />}
      >
        <Popup.Content dir={getLanguageDirection(language)}>
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
        </Popup.Content>
      </Popup>
    );
  }
}

export default FastDayPicker;
