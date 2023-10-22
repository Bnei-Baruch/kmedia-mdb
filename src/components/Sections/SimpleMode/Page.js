'use client';
import React, { useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DayPicker from 'react-day-picker';
import Navbar from 'react-day-picker/build/Navbar';
import MomentLocaleUtils from 'react-day-picker/moment';
import { useTranslation } from 'next-i18next';
import { Button, Card, Divider, Grid, Input } from 'semantic-ui-react';
import { useSelector } from 'react-redux';

import { selectors as settings } from '../../../../lib/redux/slices/settingsSlice/settingsSlice';
import { ALL_LANGUAGES, FN_DATE_FILTER, PAGE_NS_SIMPLE_MODE, DATE_FORMAT } from '../../../helpers/consts';
import { today } from '../../../helpers/date';
import SectionHeader from '../../shared/SectionHeader';
import YearMonthForm from '../../Filters/components/Date/YearMonthForm';
import SimpleModeList from './list';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import MenuLanguageSelector from '../../Language/Selector/MenuLanguageSelector';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { updateFiltersSearchParams } from '../../../../lib/filters/helper';
import { definitionsByName } from '../../../../lib/filters/transformer';
import { selectors as filters } from '../../../../lib/redux/slices/filterSlice/filterSlice';

const changeDay = (amount, selectedDate, onDayClick) => {
  const newDate = moment(selectedDate).add(amount, 'd').toDate();
  onDayClick(newDate);
};

const getNavBarElement = (props, uiLang, onDayClick) => {
  const { month, localeUtils } = props;
  return (
    <div className="DayPicker-Month">
      <Navbar {...props} className="FastDayPicker-DayPicker-NavButton" />
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

const openNativeDatePicker = (nativeDateInput, deviceInfo) => {
  if (deviceInfo.os.name === 'Android') {
    nativeDateInput.current.click();
  } else {
    nativeDateInput.current.focus();
  }
};

const isToday = selectedDate => moment().isSame(moment(selectedDate), 'date');

const LocaleDateFormat = moment.localeData().longDateFormat('L');

const SimpleModePage = ({ filesLanguages, onLanguageChange, renderUnit }) => {
  const { t }    = useTranslation();
  const uiLang   = useSelector(state => settings.getUILang(state.settings));
  const selected = useSelector(state => filters.getFilterByName(state.filters, PAGE_NS_SIMPLE_MODE, FN_DATE_FILTER)[0]);

  const selectedDate = selected?.from ? moment(selected.from, DATE_FORMAT).toDate() : new Date();

  const nativeDateInput                = useRef(null);
  const { isMobileDevice, deviceInfo } = useContext(DeviceInfoContext);

  const searchParams = useSearchParams();
  const router       = useRouter();

  const onDayClick = (selDate, { disabled } = {}) => {
    if (disabled) {
      return;
    }

    const _q    = { from: moment(selDate).toDate(), to: moment(selDate).toDate() };
    const query = updateFiltersSearchParams(
      definitionsByName[FN_DATE_FILTER].valueToQuery(_q),
      true,
      FN_DATE_FILTER,
      searchParams,
      true
    );
    router.push({ query });
  };

  const handleNativeDateInputChange = event => {
    if (event && event.target.value !== '') {
      onDayClick(event.target.valueAsDate);
    }
  };

  return (
    <div>
      <SectionHeader section="simple-mode" />
      <Divider fitted />
      <Grid padded container>
        <Grid.Row className="no-padding-top">
          <Grid.Column mobile={16} computer={12} tablet={16}>
            <div className="summary-container">
              <div className="controller">
                <h4>{t('simple-mode.date')}</h4>
                <div className="date-container">
                  <button type="button" onClick={() => changeDay(-1, selectedDate, onDayClick)}>{t('simple-mode.prev')}</button>
                  {
                    isMobileDevice
                      ? (
                        <div>
                          <div className="ui input">
                            <Input
                              icon="dropdown"
                              type="text"
                              readOnly
                              value={moment(selectedDate).format(LocaleDateFormat)}
                              onClick={() => openNativeDatePicker(nativeDateInput, deviceInfo)}
                            />
                          </div>
                          <input
                            className="hide-native-date-input"
                            type="date"
                            value={selectedDate.format('YYYY-MM-DD')}
                            max={today().format('YYYY-MM-DD')}
                            step="1"
                            pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
                            onChange={handleNativeDateInputChange}
                            ref={nativeDateInput}
                          />
                        </div>
                      ) : <span>{moment(selectedDate).format('MMM DD, YYYY')}</span>
                  }
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
            <SimpleModeList filesLanguages={filesLanguages} renderUnit={renderUnit} />
          </Grid.Column>
          <Grid.Column only="tablet computer" tablet={16} computer={4}>
            <div className="stick-calendar">
              <div className="summary-container adjust-height">
                <div className="controller">
                  <h4>{t('simple-mode.choose-date')}</h4>
                </div>
              </div>
              <Card>
                <DayPicker
                  locale={uiLang}
                  modifiers={{ selected: selectedDate }}
                  localeUtils={MomentLocaleUtils}
                  selectedDays={selectedDate}
                  month={selectedDate}
                  disabledDays={{ after: new Date() }}
                  onDayClick={onDayClick}
                  captionElement={() => null}
                  navbarElement={props => getNavBarElement(props, uiLang, onDayClick)}
                />
                <Button className="inline-button" onClick={() => onDayClick(new Date())} content={t('simple-mode.today-button')} />
              </Card>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

SimpleModePage.propTypes = {
  filesLanguages: PropTypes.arrayOf(PropTypes.string).isRequired,
  renderUnit: PropTypes.func.isRequired,
  onLanguageChange: PropTypes.func.isRequired,
};

export default SimpleModePage;
