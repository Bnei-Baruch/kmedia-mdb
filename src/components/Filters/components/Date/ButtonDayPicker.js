import React, { Component } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import moment from 'moment';
import scrollIntoView from 'scroll-into-view';
import Navbar from 'react-day-picker/lib/react-day-picker.min';
import MomentLocaleUtils, { formatDate } from 'react-day-picker/moment';
import { Button, Icon, Input, Modal, Popup, Segment } from 'semantic-ui-react';
import 'react-day-picker/lib/style.css';

import { today } from '../../../../helpers/date';
import { getLanguageDirection, getLanguageLocaleWORegion } from '../../../../helpers/i18n-utils';
import YearMonthForm from './YearMonthForm';

import DayPicker from 'react-day-picker';
import { withTranslation } from 'react-i18next';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';

class ButtonDayPickerOriginal extends Component {
  static contextType = DeviceInfoContext;

  static propTypes = {
    value: PropTypes.instanceOf(Date),
    label: PropTypes.string,
    onDayChange: PropTypes.func,
    language: PropTypes.string.isRequired,
  };

  static defaultProps = {
    value: null,
    label: '',
    onDayChange: noop,
  };

  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  state = {
    month: null,
    isPopupOpen: false,
    isNativePopupOpen: false,
    value: null,
    stringValue: null,
  };

  localeDateFormat      = moment.localeData().longDateFormat('L');
  localeDateFormatShort = this.localeDateFormat.replace('DD', 'D').replace('MM', 'M');

  static getDerivedStateFromProps(props, state) {
    const { value, language } = state;

    if (props.value !== value ||
      props.language !== language) {
      return {
        value: props.value,
        stringValue: ButtonDayPickerOriginal.formatDateValue(props.value, props.language),
        language: props.language,
        langDir: getLanguageDirection(props.language),
        locale: getLanguageLocaleWORegion(props.language),
      };
    }
    return null;
  }

  static formatDateValue(date, locale) {
    return date ? formatDate(date, 'l', locale) : '';
  }

  handleYearMonthChange = (month) => {
    this.setState({ month });
  };

  handleDayPickerRef = () => {
    if (this.myRef) {
      scrollIntoView(this.myRef, {
        time: 150, // half a second
        validTarget: target => target !== window,
      });
    }
  };

  handleNativeDateInputRef = (ref) => {
    this.nativeDateInput = ref;
  };

  handleNativeDateInputChange = (event) => {
    const date            = event.target.valueAsDate;
    const { onDayChange } = this.props;
    const { deviceInfo }  = this.context;
    this.setState({ selectedDate: date });
    if (deviceInfo.os.name !== 'iOS') {
      onDayChange(date);
    }
  };

  openNativeDatePicker = () => {
    const { deviceInfo } = this.context;
    if (deviceInfo.os.name === 'Android') {
      this.nativeDateInput.click();
      return;
    }
    this.nativeDateInput.focus();
  };

  applySelectedDate = () => {
    const { onDayChange, value } = this.props;
    const { selectedDate }       = this.state;
    const selected               = selectedDate || value || today().toDate();
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

  openPopup  = () => this.setState({ isPopupOpen: true });
  closePopup = () => this.setState({ isPopupOpen: false });

  openNativePopup  = () => this.setState({ isNativePopupOpen: true });
  closeNativePopup = () => this.setState({ isNativePopupOpen: false });

  onPopupDayChange = (date) => {
    if (date > today().add(1, 'days').toDate()) {
      return;
    }
    const { onDayChange } = this.props;
    const { locale }      = this.state;
    this.setState({ stringValue: ButtonDayPickerOriginal.formatDateValue(date, locale) });
    onDayChange(date);
    this.closePopup();
  };

  handleDateInputChange = (event, data) => {
    const { onDayChange } = this.props;
    const day             = moment(data.value, this.localeDateFormatShort, true);
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
    const { language, t, value, label }                                            = this.props;
    const { month, isPopupOpen, isNativePopupOpen, selectedDate, langDir, locale } = this.state;
    const { deviceInfo, isMobileDevice }                                           = this.context;

    if (isMobileDevice) {
      const selected         = selectedDate || value;
      const selectedToString = selected ? moment(selected).format('YYYY-MM-DD') : '';

      const dateButton = (
        <button className="ui button dateButton" onClick={this.openNativeDatePicker}>
          <i aria-hidden="true" className={isMobileDevice ? 'calendar alternate outline large icon' : 'calendar alternate outline icon'} />
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
      if (deviceInfo.os.name !== 'iOS') {
        return dateButton;
      }

      const selectedInLocaleFormat = moment(selected).format(this.localeDateFormat);
      return (
        <Modal
          open={isNativePopupOpen}
          onOpen={this.openNativePopup}
          trigger={
            dateButton
          }
        >
          <Modal.Content dir={langDir}>
            <Input
              fluid
              size="small"
              readOnly={true}
              value={selectedInLocaleFormat}
              onClick={this.openNativeDatePicker}>
              <input />
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
        <Popup.Content dir={langDir}>
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

const Extended = withTranslation()(ButtonDayPickerOriginal);

class ButtonDayPicker extends Component {
  render() {
    return <Extended useSuspense={false} {...this.props} />;
  }
}

export default ButtonDayPicker;
