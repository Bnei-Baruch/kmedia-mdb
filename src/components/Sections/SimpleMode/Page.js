import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DayPicker from 'react-day-picker';
import Navbar from 'react-day-picker/build/Navbar';
import MomentLocaleUtils from 'react-day-picker/moment';
import { withTranslation } from 'react-i18next';
import { Button, Card, Divider, Grid, Input } from 'semantic-ui-react';
import { useSelector } from 'react-redux';

import { ALL_LANGUAGES } from '../../../helpers/consts';
import { today } from '../../../helpers/date';
import SectionHeader from '../../shared/SectionHeader';
import YearMonthForm from '../../Filters/components/Date/YearMonthForm';
import SimpleModeList from './list';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import MenuLanguageSelector from '../../Language/Selector/MenuLanguageSelector';
import { settingsGetUILangSelector } from '../../../redux/selectors';

const changeDay = (amount, selectedDate, onDayClick) => {
  const newDate = moment(selectedDate).add(amount, 'd').toDate();
  onDayClick(newDate);
};

const getNavBarElement = (props, uiLang, onDayClick) => {
  const { month, localeUtils } = props;
  return (
    <div className="DayPicker-Month">
      <Navbar {...props} className="FastDayPicker-DayPicker-NavButton"/>
      <YearMonthForm
        date={month}
        uiLang={uiLang}
        localeUtils={localeUtils}
        onChange={onDayClick}
        className="float-left"
      />
    </div>
  );
};

const datePickerButton = (nativeDateInput, handleNativeDateInputChange, data, isMobileDevice, deviceInfo) =>
  isMobileDevice
    ? (
      <div>
        <div className="ui input">
          <Input
            icon="dropdown"
            type="text"
            readOnly
            value={data.selectedInLocaleFormat}
            onClick={() => openNativeDatePicker(nativeDateInput, deviceInfo)}
          />
        </div>
        <input
          className="hide-native-date-input"
          type="date"
          value={data.selectedToString}
          max={today().format('YYYY-MM-DD')}
          step="1"
          pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
          onChange={handleNativeDateInputChange}
          ref={nativeDateInput}
        />
      </div>
    )
    : <span>{moment(data.selectedDate).format(data.dateFormat)}</span>;

const openNativeDatePicker = (nativeDateInput, deviceInfo) => {
  if (deviceInfo.os.name === 'Android') {
    nativeDateInput.current.click();
  } else {
    nativeDateInput.current.focus();
  }
};

const isToday = selectedDate => moment().isSame(moment(selectedDate), 'date');

const LocaleDateFormat = moment.localeData().longDateFormat('L');
const ToDay            = today().toDate();

const SimpleModePage = (
  {
    selectedDate = new Date(),
    t,
    filesLanguages,
    blinkLangSelect,
    onLanguageChange,
    renderUnit,
    onDayClick
  }
) => {
  const uiLang = useSelector(settingsGetUILangSelector);

  const [isClient, setIsClient] = useState(false);
  const [data, setData]         = useState({
    selected              : ToDay,
    selectedDate,
    selectedToString      : moment(ToDay).format('YYYY-MM-DD'),
    selectedInLocaleFormat: moment(ToDay).format(LocaleDateFormat),
    dateFormat            : 'MMM DD, YYYY',
    DayPickerModifiers    : {
      selected: selectedDate
    }
  });

  const nativeDateInput                = useRef(null);
  const { isMobileDevice, deviceInfo } = useContext(DeviceInfoContext);

  useEffect(() => {
    setIsClient(typeof window !== 'undefined');
  }, []);

  useEffect(() => {
    if (isClient) {
      const selected = selectedDate || today().toDate();
      setData({
        selected,
        selectedDate,
        selectedToString      : moment(selected).format('YYYY-MM-DD'),
        selectedInLocaleFormat: moment(selected).format(LocaleDateFormat),
        dateFormat            : uiLang === 'en' ? 'MMM DD, YYYY' : 'DD MMM, YYYY',
        DayPickerModifiers    : {
          selected: selectedDate
        }
      });
    }
  }, [selectedDate, uiLang, isClient]);

  const handleNativeDateInputChange = event => {
    if (event && event.target.value !== '') {
      onDayClick(event.target.valueAsDate);
    }
  };

  const renderDatePicker = () =>
    isClient &&
    <Card>
      <DayPicker
        locale={uiLang}
        modifiers={data.DayPickerModifiers}
        localeUtils={MomentLocaleUtils}
        selectedDays={selectedDate}
        month={selectedDate}
        disabledDays={{ after: new Date() }}
        onDayClick={onDayClick}
        captionElement={() => null}
        navbarElement={props => getNavBarElement(props, uiLang, onDayClick)}
      />
      <Button className="inline-button" onClick={() => onDayClick(new Date())} content={t('simple-mode.today-button')}/>
    </Card>;

  return (
    <div>
      <SectionHeader section="simple-mode"/>
      <Divider fitted/>
      <Grid padded container>
        <Grid.Row className="no-padding-top">
          <Grid.Column mobile={16} computer={12} tablet={16}>
            <div className="summary-container">
              <div className="controller">
                <h4>{t('simple-mode.date')}</h4>
                <div className="date-container">
                  <button type="button" onClick={() => changeDay(-1, selectedDate, onDayClick)}>{t('simple-mode.prev')}</button>
                  {datePickerButton(nativeDateInput, handleNativeDateInputChange, data, isMobileDevice, deviceInfo)}
                  <button
                    type="button"
                    disabled={isToday(selectedDate)}
                    className={isToday(selectedDate) ? 'disabled' : ''}
                    onClick={() => changeDay(1, selectedDate, onDayClick)}>{t('simple-mode.next')}</button>
                </div>
              </div>
              <div className="controller">
                <h4>
                  {t('simple-mode.media-language')}
                  {' (one of) '}
                </h4>
                <MenuLanguageSelector
                  languages={ALL_LANGUAGES}
                  selected={filesLanguages}
                  onLanguageChange={onLanguageChange}
                />
              </div>
            </div>
            <SimpleModeList filesLanguages={filesLanguages} renderUnit={renderUnit}/>
          </Grid.Column>
          <Grid.Column only="tablet computer" tablet={16} computer={4}>
            <div className="stick-calendar">
              <div className="summary-container adjust-height">
                <div className="controller">
                  <h4>{t('simple-mode.choose-date')}</h4>
                </div>
              </div>
              {renderDatePicker()}
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

SimpleModePage.propTypes = {
  selectedDate    : PropTypes.objectOf(Date),
  filesLanguages  : PropTypes.arrayOf(PropTypes.string).isRequired,
  t               : PropTypes.func.isRequired,
  renderUnit      : PropTypes.func.isRequired,
  onDayClick      : PropTypes.func.isRequired,
  onLanguageChange: PropTypes.func.isRequired,
  blinkLangSelect : PropTypes.bool.isRequired
};

export default withTranslation()(SimpleModePage);
