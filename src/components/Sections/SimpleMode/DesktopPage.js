import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DayPicker from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';
import { translate } from 'react-i18next';
import { Button, Card, Container, Divider, Grid } from 'semantic-ui-react';

import { ALL_LANGUAGES } from '../../../helpers/consts';
import * as shapes from '../../shapes';
import WipErr from '../../shared/WipErr/WipErr';
import SectionHeader from '../../shared/SectionHeader';
import { Splash } from '../../shared/Splash/Splash';
import DropdownLanguageSelector from '../../Language/Selector/DropdownLanguageSelector';
import SimpleModeList from './list';

class SimpleModeDesktopPage extends PureComponent {
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
    onLanguageChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    items: null,
    selectedDate: new Date(),
    wip: false,
    err: null,
  };

  render() {
    const
      { items, selectedDate, wip, err, language, uiLanguage, t, renderUnit, onDayClick, onLanguageChange } = this.props;

    const DayPickerModifiers = {
      selected: selectedDate
    };

    const list = WipErr({ wip, err, t }) || (
      <div>
        {
          (items.lessons.length || items.others.length) ?
            <SimpleModeList items={items} language={language} t={t} renderUnit={renderUnit} /> :
            <Splash icon="warning sign" color="red" text={t('simple-mode.no-files-found-for-date')} />
        }
      </div>
    );

    return (
      <div>
        <SectionHeader section="simple-mode" />
        <Divider fitted />
        <Container className="padded">
          <Grid>
            <Grid.Row>
              <Grid.Column mobile={16} tablet={16} computer={12}>
                <div className="summary-container">
                  <h4>{t('simple-mode.total-media-for-date')}</h4>
                  <span>{moment(selectedDate).format('l')}</span>
                  <h4>{t('simple-mode.media-language')} </h4>
                  <div className="dropdown-container">
                    <DropdownLanguageSelector
                      languages={ALL_LANGUAGES}
                      defaultValue={language}
                      onSelect={onLanguageChange}
                    />
                  </div>
                </div>
                {list}
              </Grid.Column>
              <Grid.Column mobile={16} tablet={16} computer={4}>
                <Card>
                  <DayPicker
                    locale={uiLanguage}
                    modifiers={DayPickerModifiers}
                    localeUtils={MomentLocaleUtils}
                    selectedDays={selectedDate}
                    month={selectedDate}
                    disabledDays={{ after: new Date() }}
                    onDayClick={onDayClick}
                  />
                  <Divider />
                  <Button onClick={() => onDayClick(new Date())} content={t('simple-mode.today-button')} />
                </Card>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default translate()(SimpleModeDesktopPage);
