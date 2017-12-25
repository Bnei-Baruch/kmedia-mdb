import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actions, selectors } from '../../../../redux/modules/transcription';
import { selectors as settings } from '../../../../redux/modules/settings';
import * as shapes from '../../../shapes';
import Transcription from './Transcription';

class TranscriptionContainer extends Component {
  static propTypes = {
    unit: shapes.ContentUnit.isRequired,
    content: PropTypes.shape({
      data: PropTypes.string, // actual content (HTML)
      wip: shapes.WIP,
      err: shapes.Error,
    }).isRequired,
    t: PropTypes.func.isRequired,
    fetchTranscription: PropTypes.func.isRequired,
  };

  static defaultProps = {};

  componentDidMount() {
    this.props.unit.files.filter(file => file.type === 'text').forEach(file =>
      this.props.fetchTranscription(file)
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.unit.id !== this.props.unit.id) {
      this.props.fetchTranscription(nextProps.unit);
    }
  }

  render() {
    const { unit, content, t, } = this.props;

    return (
      <Transcription
        unit={unit}
        content={content}
        t={t}
      />
    );
  }
}

export default connect(
  state => ({
    content: selectors.getTranscription(state.transcription),
    language: settings.getLanguage(state.settings),
  }),
  dispatch => bindActionCreators({
    fetchTranscription: actions.fetchTranscription,
  }, dispatch)
)(TranscriptionContainer);
