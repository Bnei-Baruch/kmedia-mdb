import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actions, selectors } from '../../../redux/modules/programs';
import { selectors as settings } from '../../../redux/modules/settings';
import { selectors as mdb } from '../../../redux/modules/mdb';
import * as shapes from '../../shapes';
import ProgramChapter from './ProgramChapter';

class ProgramChapterContainer extends Component {
  static propTypes = {
    match: shapes.RouterMatch.isRequired,
    language: PropTypes.string.isRequired,
    chapter: shapes.ProgramChapter,
    wip: shapes.WIP,
    err: shapes.Error,
    fetchProgramChapter: PropTypes.func.isRequired,
  };

  static defaultProps = {
    chapter: null,
    wip: false,
    err: null,
  };

  componentDidMount() {
    this.askForDataIfNeeded(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.askForDataIfNeeded(nextProps);
  }

  askForDataIfNeeded = (props) => {
    const { match, chapter, wip, err, fetchProgramChapter } = props;

    if (wip || err) {
      return;
    }

    // We fetch stuff if we don't have it already
    // and a request for it is not in progress or ended with an error.
    const id = match.params.id;
    if (
      chapter &&
      chapter.id === id &&
      Array.isArray(chapter.files)) {
      return;
    }

    fetchProgramChapter(id);
  };

  render() {
    const { language, chapter, wip, err } = this.props;
    return (
      <ProgramChapter
        chapter={wip || err ? null : chapter}
        language={language}
        wip={wip}
        err={err}
      />
    );
  }
}

export default connect(
  (state, ownProps) => {
    const id = ownProps.match.params.id;
    return {
      chapter: mdb.getDenormContentUnit(state.mdb, id),
      wip: selectors.getWip(state.programs).chapters[id],
      err: selectors.getErrors(state.programs).chapters[id],
      language: settings.getLanguage(state.settings),
    };
  },
  dispatch => bindActionCreators({
    fetchProgramChapter: actions.fetchProgramChapter,
  }, dispatch)
)(ProgramChapterContainer);
