import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actions, selectors } from '../../../../redux/modules/assets';
import { selectors as settings } from '../../../../redux/modules/settings';
import * as shapes from '../../../shapes';
import Transcription from './Transcription';

class TranscriptionContainer extends Component {

  static propTypes = {
    unit: shapes.ContentUnit.isRequired,
    doc2htmlById: PropTypes.objectOf(PropTypes.shape({
      data: PropTypes.string,     // actual content (HTML)
      wip: shapes.WIP,
      err: shapes.Error,
    })).isRequired,
    language: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
    doc2html: PropTypes.func.isRequired,
  };

  handleContentChange = (id) => {
    this.props.doc2html(id);
  };

  render() {
    const { unit, doc2htmlById, language, t } = this.props;

    return (
      <Transcription
        unit={unit}
        doc2htmlById={doc2htmlById}
        language={language}
        t={t}
        onContentChange={this.handleContentChange}
      />
    );
  }
}

export default connect(
  state => ({
    doc2htmlById: selectors.getDoc2htmlById(state.assets),
    language: settings.getLanguage(state.settings),
  }),
  dispatch => bindActionCreators({
    doc2html: actions.doc2html,
  }, dispatch)
)(TranscriptionContainer);
