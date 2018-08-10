import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { selectors as settings } from '../../../redux/modules/settings';
import { actions, selectors } from '../../../redux/modules/simpelMode';
import * as shapes from '../../shapes';
import Page from './Page';

class SimpleModeContainer extends Component {
  static propTypes = {
    location: shapes.HistoryLocation.isRequired,
    items: PropTypes.arrayOf(shapes.Tweet), //todo change
    wip: shapes.WIP,
    err: shapes.Error,
    language: PropTypes.string.isRequired,
    fetchAllMedia: PropTypes.func.isRequired,
  };

  static defaultProps = {
    items: [],
    wip: false,
    err: null,
  };

  constructor() {
    super();
    this.handlePageChanged = this.handlePageChanged.bind(this);
    this.state             = {
      selectedDate: new Date()
    };
  }

  componentWillReceiveProps(nextProps) {
    this.props.fetchAllMedia(this.state.selectedDate);
  }

  // eslint-disable-next-line class-methods-use-this
  extraFetchParams(props) {
  }

  handlePageChanged(pageNo) {
    window.scrollTo(0, 0);
  }

  handleLanguageChanged = () => {
    //todo
  };

  handleDayClick = (selectedDate) => {
    this.setState({ selectedDate });
  };

  render() {
    const { items, wip, err, language, location } = this.props;

    return (
      <Page
        items={items}
        selectedDate={this.state.selectedDate}
        wip={wip}
        err={err}
        language={language}
        location={location}
        onPageChange={this.handlePageChanged}
        onDayClick={this.handleDayClick}
        onLanguageChange={this.handleLanguageChanged}
      />
    );
  }
}

export const mapState = state => ({
  allMedia: selectors.getAllMedia(state.simpleMode),
  wip: selectors.getWip(state.simpleMode),
  err: selectors.getErrors(state.simpleMode),
  language: settings.getLanguage(state.settings)
});

export const mapDispatch = dispatch => (
  bindActionCreators({
    fetchAllMedia: actions.fetchAllMediaForDate,
  }, dispatch)
);

export default withRouter(connect(mapState, mapDispatch)(SimpleModeContainer));
