import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DayPicker from 'react-day-picker';
import Navbar from 'react-day-picker/lib/src/Navbar';
import MomentLocaleUtils from 'react-day-picker/moment';
import { withNamespaces } from 'react-i18next';
import { Button, Card, Container, Divider, Grid, Input } from 'semantic-ui-react';

import { ALL_LANGUAGES } from '../../../helpers/consts';
import { today } from '../../../helpers/date';
import * as shapes from '../../shapes';
import SectionHeader from '../../shared/SectionHeader';
import WipErr from '../../shared/WipErr/WipErr';
import { FrownSplash } from '../../shared/Splash/Splash';
import DropdownLanguageSelector from '../../Language/Selector/DropdownLanguageSelector';
import YearMonthForm from '../../Filters/components/Date/YearMonthForm';
import SimpleModeList from './list';
import { getOptions } from '../../../helpers/language';

const changeDay = (amount, selectedDate, onDayClick) => {
  const newDate = moment(selectedDate).add(amount, 'd').toDate();
  onDayClick(newDate);
};

const getNavBarElement = (props, language, onDayClick) => {
  const { month, localeUtils } = props;
  return (
    <div className="DayPicker-Month">
      <Navbar {...props} className="FastDayPicker-DayPicker-NavButton" />
      <YearMonthForm
        date={month}
        language={language}
        localeUtils={localeUtils}
        onChange={onDayClick}
        className="float-left"
      />
    </div>
  );
};

const datePickerButton = ({ isMobile, deviceInfo }, nativeDateInput, handleNativeDateInputChange, data) => {
  return isMobile
    ? (
      <div>
        <div className="ui input">
          <Input
            icon="dropdown"
            type="text"
            readOnly
            value={data.selectedInLocaleFormat}
            onClick={() => openNativeDatePicker(deviceInfo, nativeDateInput)}
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
};

const dropDownContainer = ({ isMobile, language, blinkLangSelect, onLanguageChange }, languages) => {
  return isMobile
    ? (
      <select className={blinkLangSelect ? 'blink' : ''} value={language} onChange={onLanguageChange}>
        {
          languages.map(x => (
            <option key={`opt-${x.flag}`} value={x.value}>
              {x.text}
            </option>
          ))
        }
      </select>
    )
    : (
      <DropdownLanguageSelector
        languages={ALL_LANGUAGES}
        defaultValue={language}
        onSelect={onLanguageChange}
        blink={blinkLangSelect}
      />
    );
};

const openNativeDatePicker = (deviceInfo, nativeDateInput) => {
  if (deviceInfo.os.name === 'Android') {
    nativeDateInput.current.click();
  } else {
    nativeDateInput.current.focus();
  }
};

const isToday = (selectedDate) => moment().isSame(moment(selectedDate), 'date');

const list = ({ items = null, wip = false, err = null, t, language, renderUnit }) => {
  const errObject = { wip, err, t };
  return WipErr(errObject) ||
    (
      <div>
        {
          (items.lessons.length || items.others.length)
            ? <SimpleModeList items={items} language={language} t={t} renderUnit={renderUnit} />
            : <FrownSplash text={t('simple-mode.no-files-found-for-date')} />
        }
      </div>
    );
};

const LocaleDateFormat = moment.localeData().longDateFormat('L');
const ToDay            = today().toDate();

const SimpleModePage = (props) => {
  const
    {
      selectedDate = new Date(),
      t,
      uiLanguage,
      onDayClick,
    } = props;

  const [isClient, setIsClient]   = useState(false);
  const [data, setData]           = useState({
    selected: ToDay,
    selectedDate,
    selectedToString: moment(ToDay).format('YYYY-MM-DD'),
    selectedInLocaleFormat: moment(ToDay).format(LocaleDateFormat),
    dateFormat: 'MMM DD, YYYY',
    DayPickerModifiers: {
      selected: selectedDate,
    },
  });
  const [languages, setLanguages] = useState([]);
  const nativeDateInput           = useRef(null);

  useEffect(() => {
    setIsClient(typeof window !== 'undefined');
  }, []);

  useEffect(() => {
    setLanguages(getOptions({ languages: ALL_LANGUAGES, t }));
  }, [t]);

  useEffect(() => {
    if (isClient) {
      const selected = selectedDate || today().toDate();
      setData({
        selected,
        selectedDate,
        selectedToString: moment(selected).format('YYYY-MM-DD'),
        selectedInLocaleFormat: moment(selected).format(LocaleDateFormat),
        dateFormat: uiLanguage === 'en' ? 'MMM DD, YYYY' : 'DD MMM, YYYY',
        DayPickerModifiers: {
          selected: selectedDate,
        },
      });
    }
  }, [selectedDate, uiLanguage, isClient]);

  const handleNativeDateInputChange = event => {
    if (event && event.target.value !== '') {
      onDayClick(event.target.valueAsDate);
    }
  };

  const renderDatePicker = () => {
    return isClient && <Card>
      <DayPicker
        locale={uiLanguage}
        modifiers={data.DayPickerModifiers}
        localeUtils={MomentLocaleUtils}
        selectedDays={selectedDate}
        month={selectedDate}
        disabledDays={{ after: new Date() }}
        onDayClick={onDayClick}
        captionElement={() => null}
        navbarElement={props => getNavBarElement(props, uiLanguage, onDayClick)}
      />
      <Button className="inline-button" onClick={() => onDayClick(new Date())} content={t('simple-mode.today-button')} />
    </Card>;
  };

  return (
    <div>
      <SectionHeader section="simple-mode" />
      <Divider fitted />
      <Container className="padded">
        <Grid>
          <Grid.Row className="no-padding-top">
            <Grid.Column mobile={16} computer={12} tablet={16}>
              <div className="summary-container">
                <div className="controller">
                  <h4>{t('simple-mode.date')}</h4>
                  <div className="date-container">
                    <button type="button" onClick={() => changeDay(-1, selectedDate, onDayClick)}>{t('simple-mode.prev')}</button>
                    {datePickerButton(props, nativeDateInput, handleNativeDateInputChange, data)}
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
                    {' '}
                  </h4>
                  <div className="dropdown-container">
                    {dropDownContainer(props, languages)}
                  </div>
                </div>
              </div>
              {list(props)}
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
      </Container>
    </div>
  );
};

SimpleModePage.propTypes = {
  items: shapes.SimpleMode,
  selectedDate: PropTypes.objectOf(Date),
  wip: shapes.WIP,
  err: shapes.Error,
  uiLanguage: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  renderUnit: PropTypes.func.isRequired,
  onDayClick: PropTypes.func.isRequired,
  onLanguageChange: PropTypes.func.isRequired,
  deviceInfo: shapes.UserAgentParserResults.isRequired,
  blinkLangSelect: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

export default withNamespaces()(SimpleModePage);
