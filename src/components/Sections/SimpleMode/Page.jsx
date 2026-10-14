import dayjs from '../../../helpers/dayjs';
import PropTypes from 'prop-types';
import { useContext, useEffect, useState, useSyncExternalStore } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { ALL_LANGUAGES } from '../../../helpers/consts';
import { today } from '../../../helpers/date';
import { getDayPickerLocale } from '../../../helpers/dayPickerLocale';
import { isToday } from '../../../helpers/utils';
import { settingsGetUILangSelector } from '../../../redux/selectors';
import MenuLanguageSelector from '../../Language/Selector/MenuLanguageSelector';
import SectionHeader from '../../shared/SectionHeader';
import SimpleModeList from './SimpleModeList';

const changeDay = (amount, selectedDate, onDayClick) => {
  const newDate = dayjs(selectedDate).add(amount, 'd').toDate();
  onDayClick(newDate);
};


const datePickerButton = (handleNativeDateInputChange, data, isMobile) =>
  isMobile
    ? (
      <div className="relative">
        <div className="ui input">
          <input
            type="text"
            readOnly
            tabIndex={-1}
            value={data.selectedInLocaleFormat}
          />
          <span className="material-symbols-outlined dropdown-icon">arrow_drop_down</span>
        </div>
        <input
          className="hide-native-date-input"
          type="date"
          value={data.selectedToString}
          max={today().format('YYYY-MM-DD')}
          step="1"
          pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
          onChange={handleNativeDateInputChange}
        />
      </div>
    )
    : <span>{dayjs(data.selectedDate).format(data.dateFormat)}</span>;

// Read at call time (not module load) so it tracks the global dayjs locale.
const getLocaleDateFormat = () => dayjs.localeData().longDateFormat('L');
const ToDay = today().toDate();

const SimpleModePage = (
  {
    selectedDate = new Date(),
    filesLanguages,
    onLanguageChange,
    renderUnit,
    onDayClick
  }
) => {
  const { t } = useTranslation();
  const uiLang = useSelector(settingsGetUILangSelector);
  const locale = getDayPickerLocale(uiLang);

  const isClient = useSyncExternalStore(() => () => {}, () => true, () => false);
  const [data, setData] = useState({
    selected: ToDay,
    selectedDate,
    selectedToString: dayjs(ToDay).format('YYYY-MM-DD'),
    selectedInLocaleFormat: dayjs(ToDay).format(getLocaleDateFormat()),
    dateFormat: 'MMM DD, YYYY',
    DayPickerModifiers: {
      selected: selectedDate
    }
  });

  const { isMobile } = useContext(DeviceInfoContext);

  const [month, setMonth] = useState(selectedDate);
  useEffect(() => setMonth(selectedDate), [selectedDate]);

  useEffect(() => {
    const selected = selectedDate || today().toDate();
    setData({
      selected,
      selectedDate,
      selectedToString: dayjs(selected).format('YYYY-MM-DD'),
      selectedInLocaleFormat: dayjs(selected).format(getLocaleDateFormat()),
      dateFormat: uiLang === 'en' ? 'MMM DD, YYYY' : 'DD MMM, YYYY',
      DayPickerModifiers: {
        selected: selectedDate
      }
    });
  }, [selectedDate, uiLang]);

  const handleNativeDateInputChange = event => {
    if (event && event.target.value !== '') {
      onDayClick(event.target.valueAsDate);
    }
  };

  const renderDatePicker = () =>
    isClient &&
    <div className="simple-mode-calendar">
      <DayPicker
        mode="single"
        captionLayout="dropdown"
        locale={locale}
        selected={selectedDate}
        month={month}
        onMonthChange={setMonth}
        startMonth={new Date(1970, 0)}
        endMonth={today().toDate()}
        disabled={{ after: new Date() }}
        onSelect={onDayClick}
      />
      <button className="today-button" onClick={() => onDayClick(new Date())}>
        {t('simple-mode.today-button')}
      </button>
    </div>;

  return (
    <div>
      <SectionHeader section="simple-mode" />
      <div className="p-[14px] flex flex-wrap">
        <div className="w-full min-[992px]:w-3/4 px-[14px]">
          <div className="summary-container">
            <div className="controller">
              <h4>{t('simple-mode.date')}</h4>
              <div className="date-container">
                <button type="button"
                  onClick={() => changeDay(-1, selectedDate, onDayClick)}>{t('simple-mode.prev')}</button>
                {datePickerButton(handleNativeDateInputChange, data, isMobile)}
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
                multiSelect={true}
              />
            </div>
          </div>
          <SimpleModeList filesLanguages={filesLanguages} renderUnit={renderUnit} selectedDate={selectedDate} />
        </div>
        <div className="hidden min-[768px]:block w-full min-[992px]:w-1/4 px-[14px]">
          <div className="stick-calendar">
            <div className="summary-container adjust-height">
              <h4 className="controller">{t('simple-mode.choose-date')}</h4>
            </div>
            {renderDatePicker()}
          </div>
        </div>
      </div>
    </div>
  );
};

SimpleModePage.propTypes = {
  selectedDate: PropTypes.objectOf(Date),
  filesLanguages: PropTypes.arrayOf(PropTypes.string).isRequired,
  renderUnit: PropTypes.func.isRequired,
  onDayClick: PropTypes.func.isRequired,
  onLanguageChange: PropTypes.func.isRequired,
};

export default SimpleModePage;
