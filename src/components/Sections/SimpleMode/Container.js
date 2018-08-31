import React, { Component } from 'react';

import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import moment from 'moment';

import { groupOtherMediaByType, renderCollection } from './renderListHelpers';
import { selectors as settings } from '../../../redux/modules/settings';
import { actions, selectors } from '../../../redux/modules/simpelMode';
import * as shapes from '../../shapes';
import Page from './Page';

export const renderUnitOrCollection = (item, language, t) => (
  item.content_units ? renderCollection(item, language, t) : groupOtherMediaByType(item, language, t)
);

class SimpleModeContainer extends Component {
  static propTypes = {
    location: shapes.HistoryLocation.isRequired,
    items: PropTypes.objectOf(shapes.SimpleMode),
    wip: shapes.WIP,
    err: shapes.Error,
    language: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
    fetchAllMedia: PropTypes.func.isRequired,
  };

  static defaultProps = {
    items: {},
    wip: false,
    err: null,
  };

  constructor() {
    super();
    this.handlePageChanged = this.handlePageChanged.bind(this);
    this.state             = {
      date: new Date(),
      filesLanguage: '',
    };
  }

  componentWillMount() {
    if (!this.state.filesLanguage) {
      const filesLanguage = this.props.language;
      this.setState({ filesLanguage });
    }
  }

  componentDidMount() {
    const date         = moment(this.state.date).format('YYYY-MM-DD');
    const { filesLanguage } = this.state;
    this.props.fetchAllMedia({ date, language: filesLanguage });
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.filesLanguage) {
      const filesLanguage = nextProps.language;
      this.setState({ filesLanguage });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  extraFetchParams(props) {
  }

  handlePageChanged(pageNo) {
    window.scrollTo(0, 0);
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

  render() {
    const { items, wip, err, t, language, location } = this.props;
    const { filesLanguage }                     = this.state;

    return (
      <Page
        items={items}
        selectedDate={this.state.date}
        wip={wip}
        err={err}
        uiLanguage={language}
        language={filesLanguage}
        t={t}
        location={location}
        renderUnit={renderUnitOrCollection}
        onPageChange={this.handlePageChanged}
        onDayClick={this.handleDayClick}
        onLanguageChange={this.handleLanguageChanged}
      />
    );
  }
}

export const mapState = state => ({
  items: selectors.getAllMedia(state.simpleMode),
  wip: selectors.getWip(state.simpleMode),
  err: selectors.getErrors(state.simpleMode),
  language: settings.getLanguage(state.settings)
});

export const mapDispatch = dispatch => (
  bindActionCreators({
    fetchAllMedia: actions.fetchAllMediaForDate,
  }, dispatch)
);

export default withRouter(connect(mapState, mapDispatch)(translate()(SimpleModeContainer)));
