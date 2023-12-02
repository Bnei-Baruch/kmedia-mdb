import React from 'react';
import PropTypes from 'prop-types';

import * as shapes from '../../../../../shapes';
import Transcription from './Transcription';

// TODO: Merge with transcriptio, no need for container.
const TranscriptionContainer = ({ unit, type = null, activeTab = 'transcription' }) => <Transcription unit={unit} type={type} activeTab={activeTab} />;

TranscriptionContainer.propTypes = {
  unit: shapes.ContentUnit.isRequired,
  type: PropTypes.string,
};

export default TranscriptionContainer;
