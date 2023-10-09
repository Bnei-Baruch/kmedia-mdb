import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { actions, selectors } from '../../../../../../redux/modules/assets';
import { selectors as settings } from '../../../../../../redux/modules/settings';
import * as shapes from '../../../../../shapes';
import Transcription from './Transcription';

// TODO: Merge with transcriptio, no need for container.
const TranscriptionContainer = ({ unit, type = null, activeTab = 'transcription' }) => {
  return <Transcription unit={unit} type={type} activeTab={activeTab} />;
};

TranscriptionContainer.propTypes = {
  unit: shapes.ContentUnit.isRequired,
  type: PropTypes.string,
};

export default TranscriptionContainer;
