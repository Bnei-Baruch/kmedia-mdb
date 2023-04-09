import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { actions, selectors } from '../../../../../../redux/modules/assets';
import { selectors as settings } from '../../../../../../redux/modules/settings';
import * as shapes from '../../../../../shapes';
import Transcription from './Transcription';

import { SessionInfoContext } from '../../../../../../helpers/app-contexts';

const TranscriptionContainer = ({ unit, type = null, activeTab = 'transcription' }) => {
  const location        = useLocation();
  const doc2htmlById    = useSelector(state => selectors.getDoc2htmlById(state.assets));
  const language        = useSelector(state => settings.getLanguage(state.settings));
  const contentLanguage = useSelector(state => settings.getContentLanguage(state.settings, location));
  const dispatch        = useDispatch();

  const handleContentChange = id => {
    dispatch(actions.doc2html(id));
    dispatch(actions.fetchTimeCode(unit.id));
  };

  return (
    <SessionInfoContext.Consumer>
      {
        (sessionInfo = {}) =>
          (
            <Transcription
              unit={unit}
              doc2htmlById={doc2htmlById}
              uiLanguage={language}
              contentLanguage={contentLanguage}
              type={type}
              onContentChange={handleContentChange}
              location={location}
              activeTab={activeTab}
              enableShareText={sessionInfo.enableShareText}
            />
          )
      }
    </SessionInfoContext.Consumer>
  );
};

TranscriptionContainer.propTypes = {
  unit: shapes.ContentUnit.isRequired,
  type: PropTypes.string,
};

export default TranscriptionContainer;
