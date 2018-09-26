import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { translate } from 'react-i18next';

import { getQuery, updateQuery } from '../../../helpers/url';
import { selectors as device } from '../../../redux/modules/device';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { selectors as settings } from '../../../redux/modules/settings';
import { actions, selectors } from '../../../redux/modules/simpelMode';
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
    fetchForDate: PropTypes.func.isRequired,
    deviceInfo: shapes.UserAgentParserResults.isRequired,
    history: shapes.History.isRequired,
  };

  static defaultProps = {
    items: {},
    wip: false,
    err: null,
  };

  state = {
    filesLanguage: '',
  };

  componentWillMount() {
    if (!this.state.filesLanguage) {
      const filesLanguage = this.props.language;
      this.setState({ filesLanguage });
    }
  }

  componentDidMount() {
    const query = getQuery(this.props.location);
    const date  = query.date ? moment(query.date, 'YYYY-MM-DD').toDate() : new Date();

    if (!this.state.date || !moment(date).isSame(this.state.date, 'day')) {
      this.handleDayClick(date);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.filesLanguage) {
      const filesLanguage = nextProps.language;
      this.setState({ filesLanguage });
    }
  }

  handleLanguageChanged = (e, filesLanguage) => {
    if (filesLanguage) {
      this.setState({ filesLanguage });
      return;
    }

    this.setState({ filesLanguage: e.currentTarget.value });
  };

  handleDayClick = (selectedDate) => {
    this.setState({ date: selectedDate });

    const date         = moment(selectedDate).format('YYYY-MM-DD');
    const { language } = this.props;
    this.props.fetchForDate({ date, language });
    updateQuery(this.props.history, query => ({
      ...query,
      date
    }));
  };

  isMobileDevice = () =>
    this.props.deviceInfo.device && this.props.deviceInfo.device.type === 'mobile';

  renderUnitOrCollection = (item, language, t) => (
    item.content_units ?
      renderCollection(item, language, t) :
      groupOtherMediaByType(item, language, t));

  render() {
    const { language }      = this.props;
    const { filesLanguage } = this.state;
    const isMobileDevice    = this.isMobileDevice();
    const pageProps         = {
      ...this.props,
      selectedDate: this.state.date,
      uiLanguage: language,
      language: filesLanguage,
      renderUnit: this.renderUnitOrCollection,
      onDayClick: this.handleDayClick,
      onLanguageChange: this.handleLanguageChanged
    };

    return isMobileDevice ? <MobilePage {...pageProps} /> : <DesktopPage {...pageProps} />;
  }
}

export const mapState = (state) => {
  const items = { ...selectors.getItems(state.simpleMode) };

  return {
    items: {
      lessons: items.lessons.map(x => mdb.getDenormCollectionWUnits(state.mdb, x)),
      others: items.others.map(x => mdb.getDenormContentUnit(state.mdb, x)),
    },
    wip: selectors.getWip(state.simpleMode),
    err: selectors.getError(state.simpleMode),
    language: settings.getLanguage(state.settings),
    deviceInfo: device.getDeviceInfo(state.device),
  };
};

export const mapDispatch = dispatch => (
  bindActionCreators({
    fetchForDate: actions.fetchForDate,
  }, dispatch)
);

export default withRouter(connect(mapState, mapDispatch)(translate()(SimpleModeContainer)));
