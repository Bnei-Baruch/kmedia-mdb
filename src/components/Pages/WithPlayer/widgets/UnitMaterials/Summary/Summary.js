import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Segment, Divider } from 'semantic-ui-react';

import { selectSuitableLanguage } from '../../../../../../helpers/language';
import * as shapes from '../../../../../shapes';
import MediaHelper from '../../../../../../helpers/media';
import { useSelector, useDispatch } from 'react-redux';
import { actions as assetsActions } from '../../../../../../redux/modules/assets';
import {
  CT_CLIP,
  CT_LESSONS,
  CT_VIDEO_PROGRAM_CHAPTER,
  CT_VIRTUAL_LESSON,
  INSERT_TYPE_SUMMARY
} from '../../../../../../helpers/consts';
import MenuLanguageSelector from '../../../../../../components/Language/Selector/MenuLanguageSelector';
import { settingsGetContentLanguagesSelector, assetsGetDoc2htmlByIdSelector } from '../../../../../../redux/selectors';

export const showSummaryTab = (unit, contentLanguages) => {
  const summaryLanguages = getSummaryLanguages(unit);
  const summaryLanguage = selectSuitableLanguage(contentLanguages, summaryLanguages, unit.original_language,
    /*defaultReturnLanguage=*/ '');

  // We should show Summary tab for specific list of content types, and if description exist or summary file.
  return [...CT_LESSONS, CT_VIDEO_PROGRAM_CHAPTER, CT_VIRTUAL_LESSON, CT_CLIP].includes(unit.content_type) &&
    (!!unit.description || !!summaryLanguage);
};

export const getSummaryLanguages = unit =>
  (unit && unit.files &&
    unit.files.filter(f =>
      MediaHelper.IsText(f) && !MediaHelper.IsPDF(f) && f.insert_type === INSERT_TYPE_SUMMARY)
      .map(f => f.language)) || [];

export const getFile = (unit, lang) => {
  if (!unit || !Array.isArray(unit.files)) {
    return null;
  }

  return unit.files?.filter(f => f.language === lang)
    .filter(f => MediaHelper.IsText(f) && !MediaHelper.IsPDF(f))
    .find(f => f.insert_type === INSERT_TYPE_SUMMARY);
};

const Summary = ({ unit, t }) => {
  const contentLanguages = useSelector(settingsGetContentLanguagesSelector);
  const doc2htmlById     = useSelector(assetsGetDoc2htmlByIdSelector);
  const dispatch         = useDispatch();

  const summaryLanguages                        = getSummaryLanguages(unit);
  const defaultLanguage                         = selectSuitableLanguage(contentLanguages, summaryLanguages, unit.original_language);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const finalLanguage                           = selectedLanguage || defaultLanguage;
  const file                                    = getFile(unit, finalLanguage);
  const selectedFileId                          = file?.id || null;

  const handleLanguageChanged = language => {
    setSelectedLanguage(language);
  };

  useEffect(() => {
    if (file) {
      dispatch(assetsActions.doc2html(selectedFileId));
    }
  }, [file, dispatch, selectedFileId]);

  const { data }    = doc2htmlById[file?.id] || false;
  const description = unit.description
    ? (<div dangerouslySetInnerHTML={{ __html: unit.description }}/>)
    : (data ? '' : t('materials.summary.no-summary'));

  return (
    <Segment basic>
      {description}
      {summaryLanguages.length <= 1 ? null :
        <MenuLanguageSelector
          languages={summaryLanguages}
          selected={finalLanguage}
          onLanguageChange={handleLanguageChanged}
          multiSelect={false}
        />
      }
      {
        data ? (
          <>
            {!!description && <Divider/>}
            <div dangerouslySetInnerHTML={{ __html: data }}></div>
          </>
        ) : null

      }
    </Segment>
  );
};

Summary.propTypes = {
  unit: shapes.ContentUnit.isRequired,
  t   : PropTypes.func.isRequired
};

export default withTranslation()(Summary);
