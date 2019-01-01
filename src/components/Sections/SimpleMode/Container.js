import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { translate } from 'react-i18next';

import { getQuery, updateQuery } from '../../../helpers/url';
import { equal, isEmpty } from '../../../helpers/utils';
import { selectors as device } from '../../../redux/modules/device';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { selectors as settings } from '../../../redux/modules/settings';
import { actions, selectors } from '../../../redux/modules/simpelMode';
import * as shapes from '../../shapes';
import Page from './Page';
import { groupOtherMediaByType, renderCollection } from './RenderListHelpers';

class SimpleModeContainer extends Component {
  static propTypes = {
    location: shapes.HistoryLocation.isRequired,
    items: shapes.SimpleMode,
    wip: shapes.WIP,
    err: shapes.Error,
    uiLanguage: PropTypes.string.isRequired,
    contentLanguage: PropTypes.string.isRequired,
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
    filesLanguage: this.props.contentLanguage,
    isMobileDevice: false,
    blinkLangSelect: false
  };

  componentDidMount() {
    const query = getQuery(this.props.location);
    const date  = (query.date && moment(query.date).isValid()) ? moment(query.date, 'YYYY-MM-DD').toDate() : new Date();

    if (!this.state.date || !moment(date).isSame(this.state.date, 'day')) {
      this.handleDayClick(date);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.filesLanguage !== nextProps.contentLanguage) {
      this.setState({ filesLanguage: nextProps.contentLanguage });
    }
    if (this.props.uiLanguage !== nextProps.uiLanguage) {
      this.handleDayClick(this.state.date, {}, nextProps);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { items, uiLanguage, contentLanguage, wip, err, } = nextProps;
    const { filesLanguage }                                 = nextState;
    const { props, state }                                  = this;

    return !(
      uiLanguage === props.uiLanguage &&
      filesLanguage === state.filesLanguage &&
      contentLanguage === state.filesLanguage &&
      equal(wip, props.wip) && equal(err, props.err) &&
      equal(items, props.items)
    );
  }

  handleLanguageChanged = (e, filesLanguage) => {
    const language = filesLanguage || e.currentTarget.value;

    this.setState({ filesLanguage: language, blinkLangSelect: false });
  };

  handleDayClick = (selectedDate, { disabled } = {}, nextProps = {}) => {
    if (disabled) {
      return;
    }

    this.setState({ date: selectedDate });

    const date     = moment(selectedDate).format('YYYY-MM-DD');
    const language = nextProps.uiLanguage || this.props.uiLanguage;
    this.props.fetchForDate({ date, language });
    updateQuery(this.props.history, query => ({
      ...query,
      date
    }));
  };

  isMobileDevice = () =>
    this.props.deviceInfo.device && this.props.deviceInfo.device.type === 'mobile';

  helpChooseLang = () => {
    this.setState({ blinkLangSelect: true });
    setTimeout(() => this.setState({ blinkLangSelect: false }), 7500);
    window.scrollTo(0, 0);
  };

  renderUnitOrCollection = (item, language, t) => (
    isEmpty(item.content_units) ?
      groupOtherMediaByType(item, language, t, this.helpChooseLang) :
      renderCollection(item, language, t, this.helpChooseLang));

  render() {
    const { filesLanguage, isMobileDevice, blinkLangSelect } = this.state;
    const pageProps                                          = {
      ...this.props,
      selectedDate: this.state.date,
      language: filesLanguage,
      renderUnit: this.renderUnitOrCollection,
      onDayClick: this.handleDayClick,
      onLanguageChange: this.handleLanguageChanged,
      blinkLangSelect: blinkLangSelect,
      isMobile: isMobileDevice
    };

    return <Page {...pageProps} />;
  }
}

export const mapState = (state) => {
  const items = { ...selectors.getItems(state.simpleMode) };

  return {
    items: {
      lessons: items.lessons.map(x => mdb.getDenormCollectionWUnits(state.mdb, x)).filter(x => !isEmpty(x)),
      others: items.others.map(x => mdb.getDenormContentUnit(state.mdb, x)).filter(x => !isEmpty(x)),
    },
    wip: selectors.getWip(state.simpleMode),
    err: selectors.getError(state.simpleMode),
    uiLanguage: settings.getLanguage(state.settings),
    contentLanguage: settings.getContentLanguage(state.settings),
    deviceInfo: device.getDeviceInfo(state.device),
  };
};

export const mapDispatch = dispatch => (
  bindActionCreators({
    fetchForDate: actions.fetchForDate,
  }, dispatch)
);

export default withRouter(connect(mapState, mapDispatch)(translate()(SimpleModeContainer)));
