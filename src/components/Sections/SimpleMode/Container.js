import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { translate } from 'react-i18next';

import { selectors as settings } from '../../../redux/modules/settings';
import { actions, selectors } from '../../../redux/modules/simpelMode';
import { selectors as device } from '../../../redux/modules/device';
import * as shapes from '../../shapes';
import DesktopPage from './DesktopPage';
import MobilePage from './MobilePage';
import { groupOtherMediaByType, renderCollection } from './RenderListHelpers';

class SimpleModeContainer extends Component {
  static propTypes = {
    location: shapes.HistoryLocation.isRequired,
    items: shapes.SimpleMode,
    wip: shapes.WIP,
    err: shapes.Error,
    language: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
    fetchAllMedia: PropTypes.func.isRequired,
    deviceInfo: shapes.UserAgentParserResults.isRequired,
  };

  static defaultProps = {
    items: {},
    wip: false,
    err: null,
  };

  state = {
    date: new Date(),
    filesLanguage: '',
  };

  componentWillMount() {
    if (!this.state.filesLanguage) {
      const filesLanguage = this.props.language;
      this.setState({ filesLanguage });
    }
  }

  componentDidMount() {
    const date              = moment(this.state.date).format('YYYY-MM-DD');
    const { filesLanguage } = this.state;
    this.props.fetchAllMedia({ date, language: filesLanguage });
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.filesLanguage) {
      const filesLanguage = nextProps.language;
      this.setState({ filesLanguage });
    }
  }

  handleLanguageChanged = (e, filesLanguage) => {
    this.setState({ filesLanguage });
  };

  handleDayClick = (selectedDate) => {
    this.setState({ date: selectedDate });

    const date         = moment(selectedDate).format('YYYY-MM-DD');
    const { language } = this.props;
    this.props.fetchAllMedia({ date, language });
  };

  isMobileDevice = () =>
    this.props.deviceInfo.device && this.props.deviceInfo.device.type === 'mobile';

  renderUnitOrCollection = (item, language, t, isMobile) => (
    item.content_units ?
      renderCollection(item, language, t, isMobile) :
      groupOtherMediaByType(item, language, t, isMobile));

  render() {
    const { items, wip, err, t, language, location } = this.props;
    const { filesLanguage }                          = this.state;
    const isMobileDevice                             = this.isMobileDevice();

    return (
      isMobileDevice ?
        (<MobilePage
          items={items}
          selectedDate={this.state.date}
          wip={wip}
          err={err}
          uiLanguage={language}
          language={filesLanguage}
          t={t}
          location={location}
          renderUnit={this.renderUnitOrCollection}
          onDayClick={this.handleDayClick}
          onLanguageChange={this.handleLanguageChanged}
        />) :
        (<DesktopPage
          items={items}
          selectedDate={this.state.date}
          wip={wip}
          err={err}
          uiLanguage={language}
          language={filesLanguage}
          t={t}
          location={location}
          renderUnit={this.renderUnitOrCollection}
          onDayClick={this.handleDayClick}
          onLanguageChange={this.handleLanguageChanged}
        />)
    );
  }
}

export const mapState = state => ({
  items: selectors.getAllMedia(state.simpleMode),
  wip: selectors.getWip(state.simpleMode),
  err: selectors.getErrors(state.simpleMode),
  language: settings.getLanguage(state.settings),
  deviceInfo: device.getDeviceInfo(state.device),
});

export const mapDispatch = dispatch => (
  bindActionCreators({
    fetchAllMedia: actions.fetchAllMediaForDate,
  }, dispatch)
);

export default withRouter(connect(mapState, mapDispatch)(translate()(SimpleModeContainer)));
