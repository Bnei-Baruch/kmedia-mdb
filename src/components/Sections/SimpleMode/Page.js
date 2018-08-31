import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Container, Divider, Grid, Card, Button } from 'semantic-ui-react';
import DayPicker from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';
import * as moment from 'moment/moment';

import * as shapes from '../../shapes';
import WipErr from '../../shared/WipErr/WipErr';
import SectionHeader from '../../shared/SectionHeader';
import { ALL_LANGUAGES } from '../../../helpers/consts';
import DropdownLanguageSelector from '../../Language/Selector/DropdownLanguageSelector';
import SimpleModeList from './List';

class SimpleModePage extends PureComponent {
  static propTypes = {
    items: PropTypes.objectOf(shapes.SimpleMode),
    selectedDate: PropTypes.objectOf(Date),
    wip: shapes.WIP,
    err: shapes.Error,
    uiLanguage: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
    location: shapes.HistoryLocation.isRequired,
    renderUnit: PropTypes.func.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onDayClick: PropTypes.func.isRequired,
    onLanguageChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    items: [],
    selectedDate: new Date(),
    wip: false,
    err: null,
  };

  componentWillReceiveProps(nextProps) {
    console.log('next: ', nextProps);
  }

  render() {
    const
      { items, selectedDate, wip, err, language, uiLanguage, t, renderUnit, onDayClick, onLanguageChange } = this.props;

    const DayPickerModifiers = {
      selected: selectedDate
    };

    const list = WipErr({ wip, err, t }) || (
      <div>
        {
          items ?
            <SimpleModeList items={items} language={language} t={t} renderUnit={renderUnit} /> :
            null
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
                    disabledDays={{ after: new Date() }}
                    onDayClick={onDayClick}
                  />
                  <Divider />
                  <Button
                    onClick={() => {
                      onDayClick(new Date());
                    }}
                    content={t('simple-mode.today-button')}
                  />
                </Card>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default translate()(SimpleModePage);
