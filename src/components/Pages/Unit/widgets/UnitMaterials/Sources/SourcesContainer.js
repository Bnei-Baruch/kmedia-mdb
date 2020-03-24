import React, { useCallback, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { isEmpty } from '../../../../../../helpers/utils';
import { selectors } from '../../../../../../redux/modules/sources';
import { actions as assetsActions, selectors as assetsSelectors } from '../../../../../../redux/modules/assets';
import { selectors as settings } from '../../../../../../redux/modules/settings';
import * as shapes from '../../../../../shapes';
import Sources from './Sources';

const handleContentChange = (id, name, deriveId, fetchAsset, doc2html) => {
  if (deriveId) {
    doc2html(deriveId);
  } else {
    fetchAsset(`sources/${id}/${name}`);
  }
};

const SourcesContainer = ({ unit }) => {
  const dispatch        = useDispatch();
  const sourceIndex     = useCallback(k => dispatch(assetsActions.sourceIndex(k)), [dispatch]);
  const fetchAsset      = useCallback((name) => dispatch(assetsActions.fetchAsset(name)), [dispatch]);
  const doc2html        = useCallback(deriveId => dispatch(assetsActions.doc2html(deriveId)), [dispatch]);
  
  const indexById       = useSelector(state => assetsSelectors.getSourceIndexById(state.assets));
  const reducer         = useCallback((acc, val) => {
    acc[val] = indexById[val];
    return acc;
  }, [indexById]);

  const indexMap        = useCallback(sources => (sources || []).reduce(reducer, {}), [reducer]);
  
  const content         = useSelector(state => assetsSelectors.getAsset(state.assets));
  const doc2htmlById    = useSelector(state => assetsSelectors.getDoc2htmlById(state.assets));
  const language        = useSelector(state => settings.getLanguage(state.settings));
  const contentLanguage = useSelector(state => settings.getContentLanguage(state.settings));
  const getSourceById   = useSelector(state => selectors.getSourceById(state.sources));

  useEffect(() => {
    Object.entries(indexMap(unit.sources)).forEach(([k, v]) => {
      if (isEmpty(v)) {
        sourceIndex(k);
      }
    });
  }, [unit.sources, indexMap, sourceIndex]);

  return (
    <Sources
      unit={unit}
      indexMap={indexMap(unit.sources)}
      content={content}
      doc2htmlById={doc2htmlById}
      uiLanguage={language}
      contentLanguage={contentLanguage}
      getSourceById={getSourceById}
      onContentChange={(id, name, deriveId) => handleContentChange(id, name, deriveId, fetchAsset, doc2html)}
    />
  );
};

export default withNamespaces()(SourcesContainer);

SourcesContainer.propTypes = {
  unit: shapes.ContentUnit.isRequired,
};

