import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DayPicker from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';
import { translate } from 'react-i18next';
import { Button, Card, Container, Divider, Grid, Input } from 'semantic-ui-react';

import { ALL_LANGUAGES, LANGUAGE_OPTIONS } from '../../../helpers/consts';
import { today } from '../../../helpers/date';
import * as shapes from '../../shapes';
import SectionHeader from '../../shared/SectionHeader';
import WipErr from '../../shared/WipErr/WipErr';
import { FrownSplash } from '../../shared/Splash/Splash';
import DropdownLanguageSelector from '../../Language/Selector/DropdownLanguageSelector';
import YearMonthForm from '../../Filters/components/Date/YearMonthForm';
import SimpleModeList from './list';

class SimpleModePage extends PureComponent {
  static propTypes = {
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

  static defaultProps = {
    items: null,
    selectedDate: new Date(),
    wip: false,
    err: null,
  };

  getOptions = (props) => {
    const { languages, t } = props;

    return LANGUAGE_OPTIONS
      .filter(x => languages.includes(x.value))
      .map(x => ({ ...x, text: t(`constants.languages.${x.value}`) }));
  };

  changeDay(amount) {
    const newDate = moment(this.props.selectedDate).add(amount, 'd').toDate();
    this.props.onDayClick(newDate);
  }

  handleNativeDateInputRef = (ref) => {
    this.nativeDateInput = ref;
  };

  handleNativeDateInputChange = (event) => {
    if (event && event.target.value !== '') {
      this.props.onDayClick(event.target.valueAsDate);
    }
  };

  openNativeDatePicker = () => {
    if (this.props.deviceInfo.os.name === 'Android') {
      this.nativeDateInput.click();
      return;
    }

    this.nativeDateInput.focus();
  };

  render() {
    const
      {
        items,
        selectedDate,
        wip,
        err,
        language,
        t,
        renderUnit,
        onLanguageChange,
        blinkLangSelect,
        uiLanguage,
        isMobile,
        onDayClick
      } = this.props;

    const selected               = selectedDate || today().toDate();
    const selectedToString       = moment(selected).format('YYYY-MM-DD');
    const localeDateFormat       = moment.localeData().longDateFormat('L');
    const selectedInLocaleFormat = moment(selected).format(localeDateFormat);
    const languages              = this.getOptions({ languages: ALL_LANGUAGES, t });
    const dateFormat             = uiLanguage === 'en' ? 'MMM DD, YYYY' : 'DD MMM, YYYY';

    const DayPickerModifiers = {
      selected: selectedDate
    };

    const isToday = () => {
      return moment().isSame(moment(selectedDate), 'date');
    };

    const list = WipErr({ wip, err, t }) || (
      <div>
        {
          (items.lessons.length || items.others.length) ?
            <SimpleModeList items={items} language={language} t={t} renderUnit={renderUnit} /> :
            <FrownSplash text={t('simple-mode.no-files-found-for-date')} />
        }
      </div>
    );

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
                      <button onClick={() => this.changeDay(-1)}>{t('simple-mode.prev')}</button>
                      {
                        isMobile ?
                          <div>
                            <div className="ui input">
                              <Input
                                icon="dropdown"
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
                          :
                          <span>{moment(selectedDate).format(dateFormat)}</span>
                      }
                      <button disabled={isToday()} className={isToday() ? 'disabled' : ''} onClick={() => this.changeDay(1)}>{t('simple-mode.next')}</button>
                    </div>
                  </div>
                  <div className="controller">
                    <h4>{t('simple-mode.media-language')} </h4>
                    <div className="dropdown-container">
                      {
                        isMobile ?
                          <select className={blinkLangSelect ? 'blink' : ''} value={language} onChange={onLanguageChange}>
                            {
                              languages.map(x => (
                                <option key={`opt-${x.flag}`} value={x.value}>
                                  {x.text}
                                </option>
                              ))
                            }
                          </select>
                          :
                          <DropdownLanguageSelector
                            languages={ALL_LANGUAGES}
                            defaultValue={language}
                            onSelect={onLanguageChange}
                            blink={blinkLangSelect}
                          />
                      }
                    </div>
                  </div>
                </div>
                {list}
              </Grid.Column>
              <Grid.Column only='tablet computer' tablet={16} computer={4}>
                <div className="stick-calendar">
                  <div className="summary-container adjust-height">
                    <div className="controller">
                      <h4>{t('simple-mode.choose-date')}</h4>
                    </div>
                  </div>
                  <Card>
                    <DayPicker
                      locale={uiLanguage}
                      modifiers={DayPickerModifiers}
                      localeUtils={MomentLocaleUtils}
                      selectedDays={selectedDate}
                      month={selectedDate}
                      disabledDays={{ after: new Date() }}
                      onDayClick={onDayClick}
                      captionElement={({ date, localeUtils }) => (
                        <YearMonthForm
                          date={date}
                          language={language}
                          localeUtils={localeUtils}
                          onChange={onDayClick}
                        />
                      )}
                    />
                    <Button className="inline-button" onClick={() => onDayClick(new Date())} content={t('simple-mode.today-button')} />
                  </Card>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default translate()(SimpleModePage);
