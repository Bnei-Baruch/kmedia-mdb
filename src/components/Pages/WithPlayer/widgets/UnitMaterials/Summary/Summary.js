import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Segment, Divider } from 'semantic-ui-react';

import { selectSuitableLanguage } from '../../../../../../helpers/language';
import * as shapes from '../../../../../shapes';
import MediaHelper from '../../../../../../helpers/media';
import { useSelector, useDispatch } from 'react-redux';
import { selectors as settings } from '../../../../../../redux/modules/settings';
import { selectors as assetsSelectors, actions as assetsActions } from '../../../../../../redux/modules/assets';
import { INSERT_TYPE_SUMMARY } from '../../../../../../helpers/consts';
import MenuLanguageSelector from '../../../../../../components/Language/Selector/MenuLanguageSelector';

const Summary = ({ unit, t }) => {

  const contentLanguages = useSelector(state => settings.getContentLanguages(state.settings));
  const doc2htmlById     = useSelector(state => assetsSelectors.getDoc2htmlById(state.assets));
  const dispatch         = useDispatch();

  const summaryLanguages = (unit && unit.files && unit.files.filter(f => MediaHelper.IsText(f) && !MediaHelper.IsPDF(f) && f.insert_type === INSERT_TYPE_SUMMARY).map(f => f.language)) || [];
  const defaultLanguage = selectSuitableLanguage(contentLanguages, summaryLanguages, unit.original_language);
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);

  const description = unit.description
    ? (<div dangerouslySetInnerHTML={{ __html: unit.description }} />)
    : t('materials.summary.no-summary');

  const getFile = lang => {
    if (!unit || !Array.isArray(unit.files)) {
      return null;
    }

    return unit.files?.filter(f => f.language === lang)
      .filter(f => MediaHelper.IsText(f) && !MediaHelper.IsPDF(f))
      .find(f => f.insert_type === INSERT_TYPE_SUMMARY);
  };

  const file = getFile(selectedLanguage);
  const [selectedFileId, setSelectedFileId] = useState((file && file.id) || null);

  const handleLanguageChanged = selectedLanguage => {
    const file = getFile(selectedLanguage);
    setSelectedFileId((file && file.id) || null);
    setSelectedLanguage(selectedLanguage);
  }

  useEffect(() => {
    if (file) {
      dispatch(assetsActions.doc2html(selectedFileId));
    }
  }, [dispatch, selectedFileId]);

  const { data } = doc2htmlById[file?.id] || false;
  return (
    <Segment basic>
      {description}
      {summaryLanguages.length <= 1 ? null :
        <MenuLanguageSelector
          languages={summaryLanguages}
          selected={selectedLanguage}
          onLanguageChange={handleLanguageChanged}
          multiSelect={false}
        />
      }
      {
        data ? (
          <>
            <Divider />
            <div dangerouslySetInnerHTML={{ __html: data }}></div>
          </>
        ) : null

      }
    </Segment>
  );
};

Summary.propTypes = {
  unit: shapes.ContentUnit.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(Summary);
