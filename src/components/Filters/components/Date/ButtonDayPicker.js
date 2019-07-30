import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import moment from 'moment';
import scrollIntoView from 'scroll-into-view';
import Navbar from 'react-day-picker/lib/src/Navbar';
import MomentLocaleUtils, { formatDate } from 'react-day-picker/moment';
import {Input, Segment, Popup, Modal, Button, Icon, Label} from 'semantic-ui-react';
import 'react-day-picker/lib/style.css';

import { today } from '../../../../helpers/date';
import { getLanguageDirection, getLanguageLocaleWORegion } from '../../../../helpers/i18n-utils';
import * as shapes from '../../../shapes';
import YearMonthForm from './YearMonthForm';

import DayPicker from 'react-day-picker';
import {withNamespaces} from "react-i18next";

class ButtonDayPicker extends Component {
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
    isPopupOpen: false,
    isNativePopupOpen: false,
    value: null,
    stringValue: null,
  };

  localeDateFormat = moment.localeData().longDateFormat('L');
  localeDateFormatShort = this.localeDateFormat.replace('DD', 'D').replace('MM', 'M');

  static getDerivedStateFromProps(props, state) {
    const { value } = state;
    if (props.value !== value) {
      return { value: props.value, stringValue: ButtonDayPicker.formatDateValue(props.value, props.language) };
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
    const date = event.target.valueAsDate;
    const { deviceInfo, onDayChange } = this.props;
    this.setState({selectedDate: date});
    if (deviceInfo.os.name !== 'iOS') {
      onDayChange(date);
    }
  };

  openNativeDatePicker = () => {
    if (this.props.deviceInfo.os.name === 'Android') {
      this.nativeDateInput.click();
      return;
    }
    this.nativeDateInput.focus();
  };

  applySelectedDate = () => {
    const { onDayChange, value } = this.props;
    const { selectedDate } = this.state;
    const selected = selectedDate || value || today().toDate();
    onDayChange(selected);
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
        <Navbar {...props} className="ButtonDayPicker-DayPicker-NavButton" />
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

  openPopup = () => this.setState({ isPopupOpen: true });
  closePopup = () => this.setState({ isPopupOpen: false });

  openNativePopup = () => this.setState({ isNativePopupOpen: true });
  closeNativePopup = () => this.setState({ isNativePopupOpen: false });

  onPopupDayChange = (date) => {
    if (date > today().add(1, 'days').toDate())
      return;
    const { onDayChange, language } = this.props;
    this.setState({ stringValue: ButtonDayPicker.formatDateValue(date, language) });
    onDayChange(date);
    this.closePopup();
  };

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
  };

  render() {
    const { language, t, value, label, deviceInfo }               = this.props;
    const { month, isPopupOpen, isNativePopupOpen, selectedDate } = this.state;
    const locale = getLanguageLocaleWORegion(language);
    const isMobileDevice = this.isMobileDevice();

    if (isMobileDevice) {
      const selected = selectedDate || value;
      const selectedToString =  selected ? moment(selected).format('YYYY-MM-DD') : null;

      const dateButton = (
        <button className="ui button dateButton" onClick={this.openNativeDatePicker}>
          <i aria-hidden="true" className={isMobileDevice ? 'calendar alternate outline large icon' : 'calendar alternate outline icon'}/>
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
        </button>
      );
      if (deviceInfo.os.name !== 'iOS')
        return dateButton;

      const selectedInLocaleFormat = moment(selected).format(this.localeDateFormat);
      return (
        <Modal
          open={isNativePopupOpen}
          onOpen={this.openNativePopup}
          trigger={
            dateButton
          }
        >
          <Modal.Content dir={getLanguageDirection(language)}>
            <Input
              fluid
              size="small"
              readOnly={true}
              value={selectedInLocaleFormat}
              onClick={this.openNativeDatePicker}>
              <input/>
              <Button
                primary
                content={t('buttons.apply')}
                onClick={this.applySelectedDate}
              />
              <Button
                primary
                content={t('buttons.cancel')}
                onClick={this.closeNativePopup}
              />
            </Input>

          </Modal.Content>
        </Modal>
      );
    }

    return (
      <Popup
        basic
        flowing
        on='focus'
        open={isPopupOpen}
        onOpen={this.openPopup}
        onClose={this.closePopup}
        trigger={
          <Button className="dateButton" onClick={this.doSearchFromClickEvent}>
            <Icon name='calendar alternate outline' />
            {label}
          </Button>
        }
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

export default withNamespaces()(ButtonDayPicker);
