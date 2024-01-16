import React, { useEffect, useState, useTransition } from 'react';
import { Segment, Divider } from 'semantic-ui-react';

import { selectSuitableLanguage } from '../../../../../../helpers/language';
import { useSelector, useDispatch } from 'react-redux';
import { selectors as settings } from '../../../../../../redux/modules/settings';
import { selectors as mdb } from '../../../../../../redux/modules/mdb';
import { selectors as assetsSelectors, actions as assetsActions } from '../../../../../../redux/modules/assets';
import MenuLanguageSelector from '../../../../../../components/Language/Selector/MenuLanguageSelector';
import { getSummaryLanguages, getFile } from './helper';
import { useParams } from 'react-router-dom';

const Summary = () => {
  const { id } = useParams();
  const { t }  = useTransition();

  const unit             = useSelector(state => mdb.getDenormContentUnit(state.mdb, id));
  const contentLanguages = useSelector(state => settings.getContentLanguages(state.settings));
  const doc2htmlById     = useSelector(state => assetsSelectors.getDoc2htmlById(state.assets));
  const dispatch         = useDispatch();

  const summaryLanguages                        = getSummaryLanguages(unit);
  const defaultLanguage                         = selectSuitableLanguage(contentLanguages, summaryLanguages, unit.original_language);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const finalLanguage                           = selectedLanguage || defaultLanguage;

  const file           = getFile(unit, finalLanguage);
  const selectedFileId = (file && file.id) || null;

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
    ? (<div dangerouslySetInnerHTML={{ __html: unit.description }} />)
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
            <Divider />
            <div dangerouslySetInnerHTML={{ __html: data }}></div>
          </>
        ) : null

      }
    </Segment>
  );
};

export default Summary;
