import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import moment from 'moment';
import scrollIntoView from 'scroll-into-view';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import Navbar from 'react-day-picker/lib/src/Navbar';
import MomentLocaleUtils, { formatDate, parseDate } from 'react-day-picker/moment';
import { Input, Segment } from 'semantic-ui-react';
import 'react-day-picker/lib/style.css';

import { today } from '../../../../helpers/date';
import { getLanguageDirection, getLanguageLocaleWORegion } from '../../../../helpers/i18n-utils';
import * as shapes from '../../../shapes';
import YearMonthForm from './YearMonthForm';

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
  };

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

  render() {
    const { language, value, label, onDayChange } = this.props;
    const { month }                               = this.state;
    const selected                                = value || today().toDate();
    const selectedToString                        = moment(selected).format('YYYY-MM-DD');
    const locale                                  = getLanguageLocaleWORegion(language);
    const localeDateFormat                        = moment.localeData().longDateFormat('L');
    const selectedInLocaleFormat                  = moment(selected).format(localeDateFormat);
    const isMobileDevice                          = this.isMobileDevice();

    if (isMobileDevice) {
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
      <div>
        <DayPickerInput
          overlayComponent={this.getOverlayComponent}
          component={Input}
          value={selected}
          onDayChange={onDayChange}
          hideOnDayClick={false}
          inputProps={{
            label,
            fluid: true,
            size: 'small',
            icon: 'calendar alternate outline'
          }}
          format="l"
          formatDate={formatDate}
          parseDate={parseDate}
          placeholder={`${formatDate(new Date(), 'l', locale)}`}
          showOverlay
          dayPickerProps={{
            month,
            toMonth: today().toDate(),
            disabledDays: { after: today().toDate() },
            locale,
            localeUtils: MomentLocaleUtils,
            dir: getLanguageDirection(language),
            ref: this.handleDayPickerRef,
            captionElement: () => null,
            navbarElement: props => this.getNavBarElement(props, language)
          }}
        />
      </div>
    );
  }
}

export default FastDayPicker;
